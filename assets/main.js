const myModal = new bootstrap.Modal(document.getElementById('modal'), {keyboard: false, backdrop: 'static'});
const toast = new bootstrap.Toast(document.getElementById('liveToast'));
let coinsLocaleCopy = []; // 100 items copy 
let chartlist = []; // will contain objs: {id:id, symbol:symbol, thumbnail:thumbnail}
let cache = [];


$('#search').on('keyup focusout change', search);
$('.nav-item').click(changeAppContent);
$("#root" ).on("change", "input[role='switch']", function() {
  handleAddToChartlist($(this)); 
});
$("#root" ).on("click", ".collapseBtn", function() { // adds click events to each .collapseBtn in root div, and toggles collapse.
  createCoinInfo( $(this).next() );
}); 

showHomePage();
 
async function showHomePage() {

  $('#root').html('').append(_SPINNER); // insert spinner

  try{
    const data = await fetchData('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1');
    const homepage =  renderCoinList(data, createCard);
    coinsLocaleCopy = Array.from(data);
    render('#root', homepage);
  }catch(error){
    render('#root', error);
  }
   
}

function renderCoinList(data,builderCallback){
    const cardList = $("<div>").addClass("row");
    for(const coin of data){
      cardList.append(builderCallback(coin));
    }
    return cardList;   
}

function createCard(coin){
    const card = `
        <div class="col-xs-12 col-sm-6 col-md-4 col-xl-3">
          <div class="card border-dark mb-3 mx-auto" style="max-width: 18rem;">
            <div class="card-header">
              <span>${coin.symbol.toUpperCase()}</span>
              <div class="form-check form-switch float-end">
                <input class="form-check-input" coin-symbol="${coin.symbol}" coin-id="${coin.id}" type="checkbox" role="switch">
              </div>
            </div>
            <div class="card-body text-dark">
              <img class="float-end" style="width:70px" src="${coin.image}" alt="image">
              <p class="card-text">${coin.name}</p>
              <button class="btn btn-primary collapseBtn">More info</button>
              <div class="collapse" id="${coin.id}">
              </div>
            </div>
          </div>
        </div>
`;
 
    return card;

}

async function createCoinInfo(element){  // el = <div class="collapse" id="${coin.id}">
  const id =  element.attr('id');
  if(!element.hasClass("show")){ element.prev().append(_SPINNER_BTN); } // add spinner to btn, only if its closed
  const data = await checkCacheAndGetData(id);
  const infoElement = `
    <div>USD price: ${data.market_data.current_price.usd} $</div>
    <div>EUR price: ${data.market_data.current_price.eur} &#8364;</div>
    <div>NIS price: ${data.market_data.current_price.ils} &#8362;</div> 
    `;
    render(element, infoElement);
    element.collapse('toggle');
    element.prev().text('More info');
}

function render(container, element){
  
  $(container).html('').append(element);

}

async function fetchData(url){
	const res = await fetch(url);
	const data = await res.json();
	return data;
}

function changeAppContent(){
  
  const page = $(this)[0].outerText;
  
  if(page == "Home"){
    showHomePage();
    resetChartlist();
    clearInterval(localStorage.getItem('interval')); // cancel canvasJS fetch loop
    disableSearch('enable');
    closeMenu();
    } 
    
    else if(page =="Live Reports"){
    if(chartlist.length){
      $('#root').html('').append(_SPINNER); // insert spinner
      buildChartData();
      disableSearch();
      closeMenu();

    } else {
      toast.show();
      closeMenu();
    }

  
  } else {
    console.log('Go to about me');
    clearInterval(localStorage.getItem('interval')); // cancel canvasJS fetch loop
    render('#root',_ABOUT)
    disableSearch();
    closeMenu();
  }
}

function closeMenu(){
  
  if(window.innerWidth <576){
    setTimeout(()=>{$('.navbar-toggler').click();},250);
  }
  
}
