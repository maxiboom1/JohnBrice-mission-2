async function buildChartData(){
	//const data = {"BTC": {"USD": 17177.02},"ETH": {"USD": 12276.03},"USDT": {"USD": 15000}};
	const url = getFetchURL();
	const data = await fetchData(url);
	const datapoints = createCanvasData(data);
	renderChart(datapoints,url);
}

function getFetchURL(){
	let requestedCurrencies = '';
	for(const coin of chartlist){
		requestedCurrencies += coin.symbol.toUpperCase() + ',';
	}
	return `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${requestedCurrencies.slice(0,-1)}&tsyms=USD&api_key={1bfdcb4109dec4ea5eff5e81cf02f425d5e12ba454dbc809b8a5ba38250a46f2}`;
}

function createCanvasData(data){
	
	const arr = [];
	
	for (const property in data) {		
		
		const datapoint = [ {x: Date.now(), y: data[property].USD} ];

		const item = {
			type:'line',
			xValueType: "dateTime", 
			yValueFormatString: "$####.00", 
			xValueFormatString: "hh:mm:ss TT", 
			showInLegend: true,
			name: property,
			dataPoints: datapoint
		};
		
		arr.push(item)
	}
	
	return arr;
		
	
}

async function fetchData(url){
	const res = await fetch(url);
	const data = await res.json();
	return data;
}

function renderChart(datapoints,url){
	
	const chart = new CanvasJS.Chart("root", {
		zoomEnabled: true,
		title: {
			text: "Share Value of Two Companies"
		},
		axisX: {
			title: "chart updates every 3 secs"
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
	
	chart.render();
	const interval = setInterval(addData,5000);
	localStorage.setItem('interval', interval);
	
	async function addData(){
		const newTime = Date.now();
		const newData = await fetchData(url);
		let i =0;
		for (const property in newData) {
			console.log(newData[property].USD)
			chart.options.data[i].dataPoints.push({y:newData[property].USD, x: newTime});
			i++;
		}
		chart.render();
	}

}
