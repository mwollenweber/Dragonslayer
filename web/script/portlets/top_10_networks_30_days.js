var top_10_networks_30_days_chart;

Top10Networks30DaysGraphPortlet = function() {
    
	top_10_networks_30_days_chart = new Ext.ux.HighChart({
        chartConfig: {
            chart: {
                defaultSeriesType: 'pie',
                margin: [50, 150, 60, 80],
                width:550,
                height:350,  
            },
            title: {
                text: 'Top 10 Compromised Networks (30 days)',
                style: {
                    margin: '10px 100px 0 0' // center it
                }
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.y +'</b><br/>'
                }
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
				type: 'pie',
				dataURL: 'controls/reports/top_10_networks_30_days.php'
			}]
        }
    });
	
	Top10Networks30DaysGraphPortlet.superclass.constructor.call(this, {
        frame:false,
        bodyStyle:'padding:5px 5px 0',
        height: 400,
        width: 800,
		loadMask:true,
        items: [top_10_networks_30_days_chart]
    });
}

Ext.extend(Top10Networks30DaysGraphPortlet, Ext.FormPanel);