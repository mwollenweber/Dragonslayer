var chart; // global

function request_day_data(day) {
    $.ajax({
        url: 'controls/day_query.php',
        data: { type: day},
        success: function(data) {
        	if (data.length == 0) { alert("No Data"); }
        	var series = chart.series[0];
        	for (i=0;i<data.length;i++) {
        		chart.series[0].addPoint(data[i],true);
        	}    
        },
        cache: false
    });
}

$(document).ready(function() {
	$("#day_filter_mon").click(function() {
		chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'data',
	            defaultSeriesType: 'pie',
	            events: {
	                load: request_day_data('mon')
	            }
	        },
	        title: {
	            text: 'Monday'
	        },
	        series: [{
	            name: 'Monday',
	            data: []
	        }]
	    });   
	});
	$("#day_filter_tue").click(function() {
		chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'data',
	            defaultSeriesType: 'pie',
	            events: {
	                load: request_day_data('tue')
	            }
	        },
	        title: {
	            text: 'Tuesday'
	        },
	        series: [{
	            name: 'Tuesday',
	            data: []
	        }]
	    });   
	});
	$("#day_filter_wed").click(function() {
		chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'data',
	            defaultSeriesType: 'pie',
	            events: {
	                load: request_day_data('wed')
	            }
	        },
	        title: {
	            text: 'Wednesday'
	        },
	        series: [{
	            name: 'Wednesday',
	            data: []
	        }]
	    });   
	});
	$("#day_filter_thu").click(function() {
		chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'data',
	            defaultSeriesType: 'pie',
	            events: {
	                load: request_day_data('thu')
	            }
	        },
	        title: {
	            text: 'Thursday'
	        },
	        series: [{
	            name: 'Thursday',
	            data: []
	        }]
	    });   
	});
	$("#day_filter_fri").click(function() {
		chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'data',
	            defaultSeriesType: 'pie',
	            events: {
	                load: request_day_data('fri')
	            }
	        },
	        title: {
	            text: 'Friday'
	        },
	        series: [{
	            name: 'Friday',
	            data: []
	        }]
	    });   
	});
	$("#day_filter_sat").click(function() {
		chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'data',
	            defaultSeriesType: 'pie',
	            events: {
	                load: request_day_data('sat')
	            }
	        },
	        title: {
	            text: 'Saturday'
	        },
	        series: [{
	            name: 'Saturday',
	            data: []
	        }]
	    });   
	});
	$("#day_filter_sun").click(function() {
		chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'data',
	            defaultSeriesType: 'pie',
	            events: {
	                load: request_day_data('sun')
	            }
	        },
	        title: {
	            text: 'Sunday'
	        },
	        series: [{
	            name: 'Sunday',
	            data: []
	        }]
	    });   
	});
});