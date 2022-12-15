const _SPINNER = `
<div class="text-center">
<div class="spinner-grow text-light" role="status" style="width: 20rem; height: 20rem;">
<span class="visually-hidden">Loading...</span>
</div>
</div>`;

const _SPINNER_BTN = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
<span class="visually-hidden">Loading...</span>`;

const _SEARCHFAIL = `<main class="container">
<div class="bg-light p-5 rounded">
  <h1>No Luck today :(</h1>
  <p class="lead">Try harder next time - no one gets ride for free.</p>
</div>
</main>`

const _COMING_SOON = `<main class="container">
<div class="bg-light p-5 rounded">
  <h1>Coming soon</h1>
  <p class="lead">We work hard to finish this page ASAP. <br>Try to check this page tommorow :)</p>
  
  <svg xmlns="http://www.w3.org/2000/svg" width="100" fill="currentColor" class="bi bi-wrench-adjustable float-end d-none d-sm-block" id="comingSoonIcon" viewBox="0 0 16 16">
  <path d="M16 4.5a4.492 4.492 0 0 1-1.703 3.526L13 5l2.959-1.11c.027.2.041.403.041.61Z"/>
  <path d="M11.5 9c.653 0 1.273-.139 1.833-.39L12 5.5 11 3l3.826-1.53A4.5 4.5 0 0 0 7.29 6.092l-6.116 5.096a2.583 2.583 0 1 0 3.638 3.638L9.908 8.71A4.49 4.49 0 0 0 11.5 9Zm-1.292-4.361-.596.893.809-.27a.25.25 0 0 1 .287.377l-.596.893.809-.27.158.475-1.5.5a.25.25 0 0 1-.287-.376l.596-.893-.809.27a.25.25 0 0 1-.287-.377l.596-.893-.809.27-.158-.475 1.5-.5a.25.25 0 0 1 .287.376ZM3 14a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
  </svg>

</div>
<br>
<br>
<h3 style='color:white'>Project description</h3> 
<iframe src="reference/27874 - Project Jquery AJAX - Crypto API.pdf" width="100%" height="830px">
</main>`

const _ABOUT = `
<div class="container mt-4 mb-4 p-3 d-flex justify-content-center">
        
<div class="card p-4">

    <div class="image d-flex flex-column justify-content-center align-items-center">

        <button class="btn btn-secondary"> <img src="assets/img/profile.png" height="100" width="100" /></button>
        <span class="name mt-3">Alex Samih-zade</span> <span class="idd">@Maxiboom1</span>
        
        <div class="d-flex flex-row justify-content-center align-items-center mt-3">
            <span class="number">5 <span class="follow">Happy JS years</span></span> </div>
        <div class=" d-flex mt-2"> 
        <button class="btn1 btn-dark" onclick="test()">Show me more</button> 
        </div>
        <div class="text mt-3">
            <span>Alex is a Full Stack Web Developer with an emphasis on complex, challenging JS coding.<br><br>
            </span>
        </div>
        
        <div class="gap-3 mt-3 icons d-flex flex-row justify-content-center align-items-center">
            <span><i class="fa fa-github"></i></span> 
            <span><i class="fa fa-facebook-f"></i></span>
        </div>            
    </div>
</div>
</div> `;

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

function test(){
    fetch('localhost');
}
