const cache = [];

function isCachedAndValid(id){
  
  const now = new Date();
  const cachedId = cache[id];
   
  try { // I use try-catch here to handle cache[id] == undefined, 
  
  if((now - cachedId.timestamp) < 15000){return true;} else {return false;} 
                                                                           
  } catch (e) {
    
    return false; // cache id is undefined (not created yet).
  
  }

}

function updateCache(id, data){
  print('New fetch and update cache');
  cache[id] = data;
  cache[id].timestamp = new Date; 
}

// Main func that triggered from openCoinInfo func.
async function checkCacheAndGetData(id){
  if(isCachedAndValid(id)){
    return cache[id];
  } else {
    const data = await fetchData('https://api.coingecko.com/api/v3/coins/' + id);
    updateCache(id, data);
    return data;
  }
}
