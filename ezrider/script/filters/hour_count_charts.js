var chart; // global

function requestData(type) {
    $.ajax({
        url: 'controls/query.php',
        data: { type: type},
        success: function(data) {
        	if (data[0].length == 0) { alert("No Data"); }
        	for (i=0;i<data[0].length;i++) {
        		chart.addSeries({"name": data[0][i], "data": data[i+1]});
        	}    
        },
        cache: false
    });
}

$(document).ready(function() {
	$("#week_link").click(function() {
		chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'data',
	            defaultSeriesType: 'column',
				zoomType: 'xy',
	            events: {
	                load: requestData('week')
	            }
	        },
	        title: {
	            text: 'Current Week'
	        },
	        xAxis: {
				title: {
					enabled: true,
					text: 'Time (Hr)'
				},
				categories: ['0', '1', '2','3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
								'13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
	        },
	        yAxis: {
				title: {
					enabled: true,
					text: 'Count'
				},
				
	        },
	    });   
	});
	$("#month_link").click(function() {
		chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'data',
	            defaultSeriesType: 'column',
				zoomType: 'xy',
	            events: {
	                load: requestData('month')
	            }
	        },
	        title: {
	            text: 'Current Month'
	        },
	        xAxis: {
				title: {
					enabled: true,
					text: 'Time (Hr)'
				},
				categories: ['0', '1', '2','3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
								'13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
	        },
	        yAxis: {
				title: {
					enabled: true,
					text: 'Count'
				},
				
	        },
	    });   
	});
	$("#year_link").click(function() {
		chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'data',
	            defaultSeriesType: 'column',
				zoomType: 'xy',
	            events: {
	                load: requestData('year')
	            }
	        },
	        title: {
	            text: 'Current Year'
	        },
	        xAxis: {
				title: {
					enabled: true,
					text: 'Time (Hr)'
				},
				categories: ['0', '1', '2','3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
								'13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
	        },
	        yAxis: {
				title: {
					enabled: true,
					text: 'Count'
				},
				
	        },
	    });   
	});
});