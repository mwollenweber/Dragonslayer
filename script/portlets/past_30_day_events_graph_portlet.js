var past_30_day_events_graph;

Past30DayEventsGraphPortlet = function() {
	
	past_30_day_events_graph = new Ext.ux.HighChart({
        chartConfig: {
            chart: {
                defaultSeriesType: 'line',
                margin: [50, 150, 60, 80]
            },
            title: {
                text: '12',
                style: {
                    margin: '10px 100px 0 0' // center it
                }
            },
            xAxis: [{
            	title: {
            		text: 'Days'
            	},
            }],
            yAxis: {
                title: {
                    text: 'Number of Cases'
                },
            },
            legend: {
                layout: 'vertical',
                style: {
                    left: 'auto',
                    bottom: 'auto',
                    right: '10px',
                    top: '100px'
                }
            },
            series: [{
				name: 'Tokyo',
				data: [[10, 20], [4, 3]]
			},
			{
				name: 'Japan',
				data: [[10, 30], [5,23], [4,7]]
			}]
        }
    });

	
    /**
     * Constructor for SearchByIpPortlet to return back the 2 created items into the portlet
     */
	Past30DayEventsGraphPortlet.superclass.constructor.call(this, {
        frame:false,
        bodyStyle:'padding:5px 5px 0',
        height: 400,
        width: 800,
		loadMask:true,
        items: [past_30_day_events_graph]
    });
}

Ext.extend(Past30DayEventsGraphPortlet, Ext.FormPanel);