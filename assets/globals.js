const _SPINNER = `
<div class="text-center">
<div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
<span class="visually-hidden">Loading...</span>
</div>
</div>`;

const _SPINNER_BTN = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
<span class="visually-hidden">Loading...</span>`;



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

// function getRandomId(idLength=10){
//     let id = '';
//     let randomIndex;
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%&=+<>?~';
//     for (let i = 0; i<idLength;i++){
//         randomIndex = Math.floor(Math.random() * chars.length);
//         id += chars[randomIndex]; 
//     }
//     return id;     
// }


const _SEARCHFAIL = `<main class="container">
<div class="bg-light p-5 rounded">
  <h1>No Luck today :(</h1>
  <p class="lead">Try harder next time - no one gets ride for free.</p>
</div>
</main>`










/*



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
*/