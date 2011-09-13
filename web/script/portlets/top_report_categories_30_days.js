var top_report_categories_30_days_chart;

TopReportCategories30DaysGraphPortlet = function() {
    
	top_report_categories_30_days_chart = new Ext.ux.HighChart({
        chartConfig: {
            chart: {
                defaultSeriesType: 'pie',
                margin: [50, 150, 60, 80],
                width:550,
                height:350,      
            },
            title: {
                text: 'Top Report Categories (30 days)',
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
                    right: '1px',
                    top: '100px'
                },
            },
	        series: [{
				type: 'pie',
				dataURL: 'controls/reports/top_report_categories_30_days.php'
			}]
        }
    });
	
	TopReportCategories30DaysGraphPortlet.superclass.constructor.call(this, {
        frame:false,
        bodyStyle:'padding:5px 5px 0',
        height: 400,
        width: 800,
		loadMask:true,
        items: [top_report_categories_30_days_chart]
    });
}

Ext.extend(TopReportCategories30DaysGraphPortlet, Ext.FormPanel);