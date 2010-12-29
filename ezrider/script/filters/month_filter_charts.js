var chart; // global

function requestMonthData(month) {
    $.ajax({
        url: 'controls/month_query.php',
        data: { type: month},
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
	$("#month_filter_jan").click(function() {
		chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'data',
	            defaultSeriesType: 'column',
				zoomType: 'xy',
	            events: {
	                load: requestMonthData('jan')
	            }
	        },
	        title: {
	            text: 'January'
	        },
	        xAxis: {
				title: {
					enabled: true,
					text: 'Time (Hr)'
				},
	        },
	        yAxis: {
				title: {
					enabled: true,
					text: 'Count'
				},
				
	        },
	    });   
	});
	$("#month_filter_feb").click(function() {
		chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'data',
	            defaultSeriesType: 'column',
				zoomType: 'xy',
	            events: {
	                load: requestMonthData('feb')
	            }
	        },
	        title: {
	            text: 'February'
	        },
	        xAxis: {
				title: {
					enabled: true,
					text: 'Time (Hr)'
				},
	        },
	        yAxis: {
				title: {
					enabled: true,
					text: 'Count'
				},
				
	        },
	    });   
	});
	$("#month_filter_mar").click(function() {
		chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'data',
	            defaultSeriesType: 'column',
				zoomType: 'xy',
	            events: {
	                load: requestMonthData('mar')
	            }
	        },
	        title: {
	            text: 'March'
	        },
	        xAxis: {
				title: {
					enabled: true,
					text: 'Time (Hr)'
				},
	        },
	        yAxis: {
				title: {
					enabled: true,
					text: 'Count'
				},
				
	        },
	    });   
	});
	$("#month_filter_apr").click(function() {
		chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'data',
	            defaultSeriesType: 'column',
				zoomType: 'xy',
	            events: {
	                load: requestMonthData('apr')
	            }
	        },
	        title: {
	            text: 'April'
	        },
	        xAxis: {
				title: {
					enabled: true,
					text: 'Time (Hr)'
				},
	        },
	        yAxis: {
				title: {
					enabled: true,
					text: 'Count'
				},
				
	        },
	    });   
	});
	$("#month_filter_may").click(function() {
		chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'data',
	            defaultSeriesType: 'column',
				zoomType: 'xy',
	            events: {
	                load: requestMonthData('may')
	            }
	        },
	        title: {
	            text: 'May'
	        },
	        xAxis: {
				title: {
					enabled: true,
					text: 'Time (Hr)'
				},
	        },
	        yAxis: {
				title: {
					enabled: true,
					text: 'Count'
				},
				
	        },
	    });   
	});
	$("#month_filter_jun").click(function() {
		chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'data',
	            defaultSeriesType: 'column',
				zoomType: 'xy',
	            events: {
	                load: requestMonthData('jun')
	            }
	        },
	        title: {
	            text: 'June'
	        },
	        xAxis: {
				title: {
					enabled: true,
					text: 'Time (Hr)'
				},
	        },
	        yAxis: {
				title: {
					enabled: true,
					text: 'Count'
				},
				
	        },
	    });   
	});
	$("#month_filter_jul").click(function() {
		chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'data',
	            defaultSeriesType: 'column',
				zoomType: 'xy',
	            events: {
	                load: requestMonthData('jul')
	            }
	        },
	        title: {
	            text: 'July'
	        },
	        xAxis: {
				title: {
					enabled: true,
					text: 'Time (Hr)'
				},
	        },
	        yAxis: {
				title: {
					enabled: true,
					text: 'Count'
				},
				
	        },
	    });   
	});
	$("#month_filter_aug").click(function() {
		chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'data',
	            defaultSeriesType: 'column',
				zoomType: 'xy',
	            events: {
	                load: requestMonthData('aug')
	            }
	        },
	        title: {
	            text: 'August'
	        },
	        xAxis: {
				title: {
					enabled: true,
					text: 'Time (Hr)'
				},
	        },
	        yAxis: {
				title: {
					enabled: true,
					text: 'Count'
				},
				
	        },
	    });   
	});
	$("#month_filter_sep").click(function() {
		chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'data',
	            defaultSeriesType: 'column',
				zoomType: 'xy',
	            events: {
	                load: requestMonthData('sep')
	            }
	        },
	        title: {
	            text: 'September'
	        },
	        xAxis: {
				title: {
					enabled: true,
					text: 'Time (Hr)'
				},
	        },
	        yAxis: {
				title: {
					enabled: true,
					text: 'Count'
				},
				
	        },
	    });   
	});
	$("#month_filter_oct").click(function() {
		chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'data',
	            defaultSeriesType: 'column',
				zoomType: 'xy',
	            events: {
	                load: requestMonthData('oct')
	            }
	        },
	        title: {
	            text: 'October'
	        },
	        xAxis: {
				title: {
					enabled: true,
					text: 'Time (Hr)'
				},
	        },
	        yAxis: {
				title: {
					enabled: true,
					text: 'Count'
				},
				
	        },
	    });   
	});
	$("#month_filter_nov").click(function() {
		chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'data',
	            defaultSeriesType: 'column',
				zoomType: 'xy',
	            events: {
	                load: requestMonthData('nov')
	            }
	        },
	        title: {
	            text: 'November'
	        },
	        xAxis: {
				title: {
					enabled: true,
					text: 'Time (Hr)'
				},
	        },
	        yAxis: {
				title: {
					enabled: true,
					text: 'Count'
				},
				
	        },
	    });   
	});
	$("#month_filter_dec").click(function() {
		chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'data',
	            defaultSeriesType: 'column',
				zoomType: 'xy',
	            events: {
	                load: requestMonthData('dec')
	            }
	        },
	        title: {
	            text: 'December'
	        },
	        xAxis: {
				title: {
					enabled: true,
					text: 'Time (Hr)'
				},
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