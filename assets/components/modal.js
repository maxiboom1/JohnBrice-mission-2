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