const cache = [];

function isCachedAndValid(id){
  
  const now = new Date();
  const cachedId = cache[id];
  if(cachedId == undefined) {return false} // Check if id is cached
  if((now - cachedId.timestamp) < 120000){  // Check if id is valid
    return true;
  } else {
    return false;
  }

}

function updateCache(id, data){
  cache[id] = data;
  cache[id].timestamp = new Date; 
}

// Main func that triggered from openCoinInfo func.
async function checkCacheAndGetData(id){
  if(isCachedAndValid(id)){
    print('Loaded from cache');
    return cache[id];
  } else {
    const data = await fetchData('https://api.coingecko.com/api/v3/coins/' + id);
    print('New fetch request');
    updateCache(id, data);
    return data;
  }
}
