// ========================================= DEBOUNCER ========================================= \\

// Originally inspired by  David Walsh (https://davidwalsh.name/javascript-debounce-function)
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// `wait` milliseconds.
const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};


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

function disableSearch(action = "disable"){
  if (action == 'enable'){
    $('#search').removeAttr("disabled"); 
  } else {
    $('#search').attr('disabled', 'disabled');
  }
}