function getFetchURL(){
   let requestedCurrencies = '';
   for(const coin of chartlist){
       requestedCurrencies += coin.symbol.toUpperCase() + ','; // will generate 'ETH,BTC,OSC,', then we slice the last ','
   }
   return `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${requestedCurrencies.slice(0,-1)}&tsyms=USD&api_key={1bfdcb4109dec4ea5eff5e81cf02f425d5e12ba454dbc809b8a5ba38250a46f2}`;
}

function createCanvasData(data){
   
   const arr = [];
   
   for (const property in data) {		
       const datapoint = [ 
        {x:Date().now -12000, y: data[property].USD},
    ];
       const item = {
           type:'spline',
           xValueType: "dateTime", 
           yValueFormatString: "$####.00", 
           xValueFormatString: "hh:mm:ss", 
           showInLegend: true,
           name: property,
           dataPoints: datapoint
       };
       
       arr.push(item);
   }
   return arr;    
}

function renderChart(datapoints,url){

    const chart = new CanvasJS.Chart("root", {
        zoomEnabled: true,
        title: {
            text: "USD Value of selected currencies"
        },
        axisX: {
            title: "We update chart every 2 sec",
            labelFormatter: function (e) {
				return CanvasJS.formatDate( e.value, "MMM DD YYYY HH:mm:ss");
			}
        },
        axisY:{
            prefix: "$"
        }, 
        toolTip: {
            shared: true
        },
        legend: {
            cursor:"pointer",
            verticalAlign: "top",
            fontSize: 22,
            fontColor: "dimGrey",
            itemclick : toggleDataSeries
        },
        data: datapoints
    });
    
   function toggleDataSeries(e) {
       if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
           e.dataSeries.visible = false;
       }
       else {
           e.dataSeries.visible = true;
       }
       chart.render();
   }
   
    async function addData(){
        const newTime = Date.now();
        const newData = await fetchData(url);
        let i =0;
        for (const property in newData) {
           chart.options.data[i].dataPoints.push({y:newData[property].USD, x: newTime});
           i++;
        }
        chart.render();
    }
   
    chart.render();
    const interval = setInterval(addData,2000);
    localStorage.setItem('interval', interval);
}

//main
async function buildChartData(){ 
    const url = getFetchURL();
    const data = await fetchData(url); //{"BTC":{"USD":16855.08}}
    const datapoints = createCanvasData(data,true);
    renderChart(datapoints,url);
}
