var weekly_contribution_chart;

WeeklyContributionGraphPortlet = function() {
    
	weekly_contribution_chart = new Ext.ux.HighChart({
        chartConfig: {
            chart: {
                defaultSeriesType: 'pie',
                margin: [50, 150, 60, 80],
                width:550,
                height:350,  
            },
            title: {
                text: 'Case Entry',
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
				dataURL: 'controls/reports/weekly_contribution.php'
			}]
        }
    });
	
	WeeklyContributionGraphPortlet.superclass.constructor.call(this, {
        frame:false,
        bodyStyle:'padding:5px 5px 0',
        height: 400,
        width: 800,
		loadMask:true,
        items: [weekly_contribution_chart]
    });
}

Ext.extend(WeeklyContributionGraphPortlet, Ext.FormPanel);