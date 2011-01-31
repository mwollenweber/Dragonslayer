var past_30_day_events_graph;

Past30DayEventsGraphPortlet = function() {
	
    var addSeries = function(){
        Ext.Ajax.request({
    	    url: 'controls/reports/past_30_day_events.php',
    	    method:'GET', 
    	    waitTitle:'Connecting', 
    	    waitMsg:'Getting data...',
    	    params: { q: "series"},
    	    success:function(request){ 
    	    	var obj = Ext.util.JSON.decode(request.responseText); 
//    	    	for(i=0;i < obj.length;i++) {
//        	    	past_30_day_events_graph.addSeries(obj[i]);	
//    	    	}
    	    	//past_30_day_events_graph.addSeries(obj); //adding data is handled through dataURL in the series
    	   },
    	});	
    }
    
	past_30_day_events_graph = new Ext.ux.HighChart({
        chartConfig: {
            chart: {
                defaultSeriesType: 'column',
                margin: [50, 150, 60, 80]
            },
            title: {
                text: 'Top 10 Events Over 30 Days',
                style: {
                    margin: '10px 100px 0 0' // center it
                }
            },
            xAxis: [{
            	title: {
            		text: 'Days'
            	},
                categories: ['2010-12-27','2010-12-22', '2010-12-15']
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
//			series: [
//			     	{"name":"mjw-gwu-test-get-jar","dataIndex":"count","xField":"date","yField":"count","dataURL":"controls/reports/past_30_day_events.php?q=mjw-gwu-test-get-jar"},
//			    	{"name":"GWU-MASS_REW2","dataIndex":"count","xField":"date","yField":"count","dataURL":"controls/reports/past_30_day_events.php?q=GWU-MASS_REW2"},
//			    	{"name":"GWU-MASS_REW","dataIndex":"count","xField":"date","yField":"count","dataURL":"controls/reports/past_30_day_events.php?q=GWU-MASS_REW"},
//			    	{"name":"GWU-MASSIVE-EXE","dataIndex":"count","xField":"date","yField":"count","dataURL":"controls/reports/past_30_day_events.php?q=GWU-MASSIVE-EXE"},
//			    	{"name":"GWU-GEN-EXE-CON","dataIndex":"count","xField":"date","yField":"count","dataURL":"controls/reports/past_30_day_events.php?q=GWU-GEN-EXE-CON"},
//			    	{"name":"ET TROJAN TDSS\/TDL\/Alureon MBR r","dataIndex":"count","xField":"date","yField":"count","dataURL":"controls/reports/past_30_day_events.php?q=ET TROJAN TDSS\/TDL\/Alureon MBR r"},
//			    	{"name":"GWU-EXE-Inline2","dataIndex":"count","xField":"date","yField":"count","dataURL":"controls/reports/past_30_day_events.php?q=GWU-EXE-Inline2"},
//			    	{"name":"ET TROJAN FakeAV Reporting - POS","dataIndex":"count","xField":"date","yField":"count","dataURL":"controls/reports/past_30_day_events.php?q=ET TROJAN FakeAV Reporting - POS"},
//			    	{"name":"BOTNET-CNC Gozi Trojan connectio","dataIndex":"count","xField":"date","yField":"count","dataURL":"controls/reports/past_30_day_events.php?q=BOTNET-CNC Gozi Trojan connectio"},
//			    	{"name":"GWU-EXE-Inline","dataIndex":"count","xField":"date","yField":"count","dataURL":"controls/reports/past_30_day_events.php?q=GWU-EXE-Inline"}
//			    ]
        }
    });

	addSeries();
	
    /**
     * Constructor for SearchByIpPortlet to return back the 2 created items into the portlet
     */
	Past30DayEventsGraphPortlet.superclass.constructor.call(this, {
        frame:false,
        bodyStyle:'padding:5px 5px 0',
        height: 700,
        width: 800,
		loadMask:true,
        items: [past_30_day_events_graph]
    });
}

Ext.extend(Past30DayEventsGraphPortlet, Ext.FormPanel);