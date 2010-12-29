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
	$("#cases_link").click(function() {
		chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'data',
	            defaultSeriesType: 'line',
				zoomType: 'xy',
	            events: {
	                load: requestData('cases')
	            }
	        },
	        title: {
	            text: 'Cases'
	        },
	        xAxis: {
				title: {
					enabled: true,
					text: 'Week'
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
	        exporting: {
	            enabled: true
	        }
	    });   
	});
});