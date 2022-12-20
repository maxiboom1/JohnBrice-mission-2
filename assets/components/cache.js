function getFromCache(id){
  console.log('getFromCache');
  console.log(cache[id]);

}

function isCachedAndValid(id){
  return false;
}

function updateCache(id, data){
  console.log('update cache');
  cache[id] = data;
  cache[id].timestamp = new Date; 
  console.log(cache);

}

async function checkCacheAndGetData(id){

  if(isCachedAndValid(id)){
    return getFromCache(id);
  } else {
    const data = await fetchData('https://api.coingecko.com/api/v3/coins/' + id);
    updateCache(id, data);
    return data;
  }

}
