const myModal = new bootstrap.Modal(document.getElementById('modal'), {keyboard: false, backdrop: 'static'});
const toast = new bootstrap.Toast(document.getElementById('liveToast'));

let coinsLocaleCopy = [];
let chartlist = [];
$('.nav-item').click(changeAppContent);

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
  
  if(!element.hasClass("show")){ element.prev().append(_SPINNER_BTN); } // add spinner to btn, only if its closed
  const data = await fetchData('https://api.coingecko.com/api/v3/coins/' + element.attr('id'))
  const infoElement = `
    <div>USD price: ${data.market_data.current_price.usd} $</div>
    <div>EUR price: ${data.market_data.current_price.eur} &#8364;</div>
    <div>NIS price: ${data.market_data.current_price.ils} &#8362;</div> 
    `;
    render(element, infoElement);
    element.collapse('toggle');
    element.prev().empty().text('More info');
}

function render(container, element){
  
  $(container).html('').append(element);

}

const search = debounce(function() { 
  const filteredArr = [];
  const searchValue = $('#search').val().toLowerCase(); // search input
  
  for(const coin of coinsLocaleCopy){
    
    const coinName = coin.name.toLowerCase();
    const coinSymbol = coin.symbol.toLowerCase();

    if (coinName.startsWith(searchValue) || coinSymbol.startsWith(searchValue)){
      filteredArr.push(coin);
    }
  }

  let searchResult = renderCoinList(filteredArr,createCard);
  if(filteredArr.length == 0){searchResult = _SEARCHFAIL;} // If no search result - print msg
  render('#root', searchResult);
  renderChartlistOnDOM();
}, 500);
$('#search').on('keyup focusout change', search);

// 5-selector logics

$("#root" ).on("change", "input[role='switch']", function() {
  handleAddToChartlist($(this)); 
});

function handleAddToChartlist(toggler){  
  const selectedId = toggler.attr("coin-id");
  const isChecked = toggler.prop("checked");
  const thumbnail = coinsLocaleCopy.find((coin)=>{return coin.id == selectedId}).image;
  const symbol = toggler.attr("coin-symbol");
  
  if(isChecked && chartlist.length<5){    
    chartlist.push({id:selectedId, symbol:symbol, thumbnail:thumbnail});
  } 
  
  else if(isChecked && chartlist.length >=5){ 
    $(toggler).prop("checked",false);
    localStorage.setItem('tempId', JSON.stringify({id:selectedId, symbol:symbol, thumbnail:thumbnail}));//set queue item
    const modalContent =  renderCoinList(chartlist,createModalCard);
    render('#modalContent', modalContent);
    myModal.show();

  } 
  
  else { // Remove unchecked element from chartlist
    const indexToRemove = chartlist.findIndex((coin)=>{return coin.id == selectedId});
    chartlist.splice(indexToRemove, 1);
  }
}

function createModalCard(coin){
  const modalCard = `
  <div class="col-xs-6 col-sm-6 col-md-4 col-xl-3">
    <div class="card border-dark mb-3 mx-auto" style="max-width: 18rem;">
      <div class="card-body">
        <img class="float-end" style="width:50px" src="${coin.thumbnail}" alt="image">
        <span>${coin.symbol.toUpperCase()}</span>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" coin-symbol="${coin.symbol}_" coin-id="${coin.id}_" role="switch" checked>
        </div>
      </div>
    </div>
  </div>
`;

  return modalCard;

}
// on user 'save' in modal dialog =>
function updateOnModalSave(el){ 
  
  const itemsToInclude = $(el).parent().prev().find('input:checked'); //list of togglers
  const itemsToExclude = $(el).parent().prev().find('input:not(:checked)'); //list of togglers
  resetChartlist(); //reset chart list
  // clear excluded togglers from DOM
  for(const item of itemsToExclude){
    const id = $(item).attr('coin-id').slice(0,-1);
    $(`input[coin-id="${id}"]`).prop("checked",false);
  }
  for(const item of itemsToInclude){ // Create 
    const id = $(item).attr('coin-id').slice(0,-1);   
    chartlist.push({
      id:id, 
      symbol:$(item).attr('coin-symbol').slice(0,-1), 
      thumbnail:$(item).parent().parent().find('img').attr('src')
    });
    $(`input[coin-id="${id}"]`).prop("checked",true);
  }
  
  if(chartlist.length < 5){

    chartlist.push(JSON.parse(localStorage.getItem('tempId')));
    const id = chartlist[chartlist.length-1].id;
    $(`input[coin-id="${id}"]`).prop("checked",true);  
  }

  myModal.hide();

}

function renderChartlistOnDOM(){
  for(const item of chartlist){ 
    $(`input[coin-id="${item.id}"]`).prop("checked",true);
  }
}

function resetChartlist(){
  chartlist.length = 0;
}

async function fetchData(url){
	const res = await fetch(url);
	const data = await res.json();
	return data;
}

function disableSearch(action = "disable"){
  if (action == 'enable'){
    $('#search').removeAttr("disabled"); 
  } else {
    $('#search').attr('disabled', 'disabled');
  }
}

function changeAppContent(){
  
  const page = $(this)[0].outerText;
  
  if(page == "Home"){
    showHomePage();
    resetChartlist();
    clearInterval(localStorage.getItem('interval')); // cancel canvasJS fetch loop
    disableSearch('enable');
    } 
    
    else if(page =="Live Reports"){
    if(chartlist.length){
      $('#root').html('').append(_SPINNER); // insert spinner
      buildChartData();
      disableSearch();
      
    } else {
      //noticeModal.show();
      toast.show()
    }

  
  } else {
    console.log('Go to about me');
    //render('#root', _COMING_SOON);
    render('#root',_ABOUT)
    disableSearch();
  }
}