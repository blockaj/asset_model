var values;

$(document).ready(function(){
	$('.regen').click(function(){
		regenerate();
	});
});

function getInputValues() {
	var sVal = parseFloat($('#s').val()),
		modelLength = parseFloat($('#l').val()),
		volitility = parseFloat($('#v').val()),
		eReturn = parseFloat($('#e').val());
	var data = [sVal, modelLength, volitility, eReturn];
	return data;
}

function formatDataForPlotting(input) {
	var plottingPoints = assetModel(input);
	var dataObj = [];
	var dataObjTwo = [];
	for (var i = 0; i < plottingPoints[1].length; i++) {
		dataObj.push({x: plottingPoints[0][i], y: plottingPoints[1][i]});
		dataObjTwo.push({x: plottingPoints[0][i], y: plottingPoints[2][i]});
	}
	return [dataObj, dataObjTwo];
}

function plot() {
	values = getInputValues();
	var dataObj = formatDataForPlotting(values);
	var chart = new CanvasJS.Chart("chartContainer", {
		axisY: {
			title: "S",
			titleFontSize: 18
		},
		axisX: {
			title: "Time",
			titleFontSize: 18
		},
       	data: [
      		{
        		type: "line",
        		dataPoints: dataObj[0]
      		}
      	]	
    });
    
    //chart = {};
    var weinerChart = new CanvasJS.Chart("weinerProcess", {
		axisY: {
			minimum: -2,
			maximum: 2,
			title: "W",
			titleFontSize: 18
		},
		axisX: {
			title: "Time",
			titleFontSize: 18
		},
    	data: [
    		{
    			type: "line",
    			dataPoints: dataObj[1]
    		}
    	]
    });
    weinerChart.render();
    chart.render();
    //weinerChart = {};
}

function assetModel(input) {
	var plot;
	var s = [];
	var w = [];
	w[0] = 0;
	if (input[0] !== 0) {
		s[0] = input[0];
		var t = input[1];
		var sigma = input[2];
		var mu = input[3];
		var dt = 1/(3*365);
		var n = Math.floor(t / dt);
		var expRD = Math.pow(Math.E, mu*dt),
			expSD = Math.pow(Math.E, Math.pow(sigma, 2)*dt);
		var down = expRD*(1-Math.sqrt(expSD-1)),
			up = expRD*(1+Math.sqrt(expSD-1));
		var dx = Math.sqrt(dt);
		var p = 0.5;
		for (var i = 0; i < n; i++) {
			var b = Math.random() < p;
			if (b) {
				s[i + 1] = s[i] * down;
				w[i + 1] = w[i] - dx;
			} else {
				s[i + 1] = s[i] * up;
				w[i + 1] = w[i] + dx;
			}
		}
		plot = linspace(0, t, n+1);
	}
	return [plot, s, w];
}

function linspace(xO, xT, n) {
	var points = [];
	if (!n) {
		n = 100;
	}
	var range = xT - xO;
	var increment = range / n;
	for (var i = 1; i < n+1; i++) {
		var value = increment * i;
		points.push(value);
	} 
	return points;
}

function regenerate() {
	var chartData = formatDataForPlotting(values);
	var chart = new CanvasJS.Chart("chartContainer", {
		axisY: {
			title: "S",
			titleFontSize: 18
		},
		axisX: {
			title: "Time",
			titleFontSize: 18
		},
       	data: [
      		{
        		type: "line",
        		dataPoints: chartData[0]
      		}
      	]	
    });
    
    var weinerChart = new CanvasJS.Chart("weinerProcess", {
		axisY: {
			minimum: -2,
			maximum: 2,
			title: "W",
			titleFontSize: 18
		},
		axisX: {
			title: "Time",
			titleFontSize: 18
		},
    	data: [
    		{
    			type: "line",
    			dataPoints: chartData[1]
    		}
    	]
    });
    weinerChart.render();
    chart.render();
}