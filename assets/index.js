const myModal = new bootstrap.Modal(document.getElementById('modal'), {keyboard: false})
let coinsLocaleCopy = [];
let chartlist = [];
$('.nav-item').click(changeAppContent);

$("#root" ).on("click", ".collapseBtn", function() { // adds click events to each .collapseBtn in root div, and toggles collapse.
  createCoinInfo( $(this).next() );
}); 

showHomePage();
 
// -------------------------- home page -------------------------- //
async function showHomePage() {

  $('#root').html('').append(_SPINNER); // insert spinner

  try{
    const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1');
    const data = await res.json();
    const homepage =  renderCoinList(data, createCard);
    coinsLocaleCopy = Array.from(data)
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
    //const id = getRandomId();
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

async function createCoinInfo(element){ 
  
  if(!element.hasClass("show")){ element.prev().append(_SPINNER_BTN); }

  const res = await fetch('https://api.coingecko.com/api/v3/coins/' + element.attr('id'));
  const data = await res.json();
  const infoElement = `
    <div>USD price: ${data.market_data.current_price.usd} $</div>
    <div>EUR price: ${data.market_data.current_price.eur} &#8364;</div>
    <div>NIS price: ${data.market_data.current_price.ils} &#8362;</div> 
    `;

    render(element, infoElement)
    element.collapse('toggle');
    element.prev().empty().text('More info');
}


function render(container, element){
  
  $(container).html('').append(element);

}

function changeAppContent(){
  const page = $(this)[0].outerText;
  if(page == "Home"){
    console.log('Go home');
    showHomePage();
  } else if(page =="Live Reports"){
    console.log('Go to live');
  } else {
    console.log('Go to about me');
  }
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

  let searchResult = renderCoinList(filteredArr);
  if(filteredArr.length == 0){searchResult = _SEARCHFAIL;} // If no search result - print msg
  render('#root', searchResult);
}, 500);
$('#search').on('keyup focusout change', search);


// 5-selector logics

$("#root" ).on("change", "input[role='switch']", function() {
  const selectedId = $(this).parent().parent().next().find('div').attr("id");
  const isChecked = $(this).prop("checked");
  handleAddToChartlist(isChecked, selectedId,this); 
});

function handleAddToChartlist(isChecked, selectedId, togglerSwitch){
    
    const coinIndexInLocale = coinsLocaleCopy.findIndex((coin)=>{return coin.id == selectedId})
    
    // add to chart list
    if(isChecked && chartlist.length<5){    
        chartlist.push(coinsLocaleCopy[coinIndexInLocale]);
    } 
    
    // Current selection is above selection limit - show modal to user
    else if(isChecked && chartlist.length >=5){ 
        //render choise modal
        $(togglerSwitch).prop("checked",false);
        localStorage.setItem('idInQueue', selectedId);
        const modalContent =  renderCoinList(chartlist,createModalCard);
        render('#modalContent', modalContent);
        myModal.show();

    } 
    
    // Remove unchecked element from chart list
    else {
        const indexToRemove = chartlist.findIndex((coin)=>{return coin.id == selectedId});
        chartlist.splice(indexToRemove, 1);
    }

    // console.log(chartlist);
}

function createModalCard(coin){
  const modalCard = `
  <div class="col-xs-6 col-sm-6 col-md-4 col-xl-3">
    <div class="card border-dark mb-3 mx-auto" style="max-width: 18rem;">
      <div class="card-body">
        <img class="float-end" style="width:50px" src="${coin.image}" alt="image">
        <span>${coin.symbol.toUpperCase()}</span>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" role="switch" checked>
        </div>
      </div>
    </div>
  </div>
`;

  return modalCard;

}

// on user 'save' in modal dialog
function updateOnModalSave(el){ 
  
  const itemsToInclude = $(el).parent().prev().find('input:checked').parent().prev();
  const itemsToExclude = $(el).parent().prev().find('input:not(:checked)').parent().prev();
  
  // clear excluded togglers
  for(const item of itemsToExclude){
    const symbol = item.innerHTML.toLowerCase();
    $(`input[coin-symbol="${symbol}"]`).prop("checked",false);
  }

  chartlist.length = 0; //reset chart list

  for(const item of itemsToInclude){ // Create 
    const symbol = item.innerHTML.toLowerCase();
    chartlist.push(coinsLocaleCopy.find(element => element.symbol == symbol));
    $(`input[coin-symbol="${symbol}"]`).prop("checked",true);

  }
  
  if(chartlist.length < 5){

    chartlist.push(coinsLocaleCopy.find(element => element.id == localStorage.getItem('idInQueue')));
    const addedSymbol = chartlist[chartlist.length-1].symbol;
    $(`input[coin-symbol="${addedSymbol}"]`).prop("checked",true);
  }


  myModal.hide();


}