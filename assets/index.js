$(function() {

const _SPINNER = `
<div class="text-center">
<div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
</div>
</div>`;


$('.nav-item').click(changeAppContent);

$("#root" ).on("click", ".collapseBtn", function() { // adds click events to each .collapseBtn in root div, and toggles collapse.
    $(this).next().collapse('toggle');
});

renderHomePage();

function renderHomePage(){
    
    fetchData('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1',renderLandingCoinList,'#root');
    console.log(data);
}

function fetchData(url,callback,asyncElement){
    
    $(asyncElement).html('').append(_SPINNER);
    fetch(url)
    .then((response) => response.json())
    .then((data) => callback(data));
  
}

function renderLandingCoinList(data){
    const gridList = $("<div>").addClass("row");
    for(const coin of data){
        gridList.append(createCard(coin));
    }
    $('#root').html('').append(gridList);
}

function createCard(coin){
    console.log(coin.symbol)
    const id = getRandomId();
    const card = `
        <div class="col-xs-12 col-sm-6 col-md-4 col-xl-3">
          <div class="card border-dark mb-3" style="max-width: 18rem;">
            <div class="card-header">
              <span>${coin.symbol.toUpperCase()}</span>
              <div class="form-check form-switch float-end">
                <input class="form-check-input" type="checkbox" role="switch">
              </div>
            </div>
            <div class="card-body text-dark">
              <p class="card-text">${coin.name}</p>
              <button class="btn btn-primary collapseBtn">More info</button>
              <div class="collapse" id="${id}">
                <img class="float-end" src="https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579" alt="">
                <div>USD price: 5$</div>
                <div>EUR price: 8</div>
                <div>NIS price: 15.2</div> 
              </div>
            </div>
          </div>
        </div>
`;
 
    return card;

}

function getRandomId(idLength=10){
    let id = '';
    let randomIndex;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%&=+<>?~';
    for (let i = 0; i<idLength;i++){
        randomIndex = Math.floor(Math.random() * chars.length);
        id += chars[randomIndex]; 
    }
    return id;     
}

function changeAppContent(){
    console.log($(this)[0].outerText);
 }



























































































});

