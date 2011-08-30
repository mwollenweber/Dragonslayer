var historical_statistics_chart;
var store;
HistoricalStatisticsChartPortlet = function() {
    
	historical_statistics_chart = new Ext.ux.HighChart({
        chartConfig: {
            chart: {
                defaultSeriesType: 'column',
                margin: [50, 150, 60, 80],
                width:600,
                height:350,  
            },
            title: {
                text: 'Historical Forecasting',
                style: {
                    margin: '10px 100px 0 0' // center it
                }
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.y +'</b><br/>'
                }
            },
            xAxis: {
                categories: [
                   'Jan', 
                   'Feb', 
                   'Mar', 
                   'Apr', 
                   'May', 
                   'Jun', 
                   'Jul', 
                   'Aug', 
                   'Sep', 
                   'Oct', 
                   'Nov', 
                   'Dec'
                ]
             },
	        series: [{
				type: 'column',
//				dataURL: 'controls/reports/historical_statistics.php'
				data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
			}]
        }
    });
	
//	historical_statistics_chart.addSeries({ name:"blah", data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4] });
//	
//    fetch_data = Ext.Ajax.request({
//        url: 'controls/reports/historical_statistics.php',
//        method:'GET', 
//        waitTitle:'Connecting', 
//        waitMsg:'Getting data...',
//        
//        success:function(request){ 
//        	var obj = Ext.util.JSON.decode(request.responseText); 
//        	for(i in obj) {
//        		historical_statistics_chart.addSeries({ name:i, data: [1,2,3] });
//        	}
//       },
//	});
	
    store = new Ext.data.JsonStore({
        fields:['name', 'visits', 'views'],
        data: [
            {name:'Jul 07', visits: 245000, views: 3000000},
            {name:'Aug 07', visits: 240000, views: 3500000},
            {name:'Sep 07', visits: 355000, views: 4000000},
            {name:'Oct 07', visits: 375000, views: 4200000},
            {name:'Nov 07', visits: 490000, views: 4500000},
            {name:'Dec 07', visits: 495000, views: 5800000},
            {name:'Jan 08', visits: 520000, views: 6000000},
            {name:'Feb 08', visits: 620000, views: 7500000}
        ]
    });

	HistoricalStatisticsChartPortlet.superclass.constructor.call(this, {
        frame:false,
        bodyStyle:'padding:5px 5px 0',
        height: 400,
        width: 800,
		loadMask:true,
//        items: [historical_statistics_chart]
		items: [{
            xtype: 'columnchart',
            store: store,
            url:'charts.swf',
            xField: 'name',
            yAxis: new Ext.chart.NumericAxis({
                displayName: 'Visits',
                labelRenderer : Ext.util.Format.numberRenderer('0,0')
            }),
            tipRenderer : function(chart, record, index, series){
                if(series.yField == 'visits'){
                    return Ext.util.Format.number(record.data.visits, '0,0') + ' visits in ' + record.data.name;
                }else{
                    return Ext.util.Format.number(record.data.views, '0,0') + ' page views in ' + record.data.name;
                }
            },
            chartStyle: {
                padding: 10,
                animationEnabled: true,
                font: {
                    name: 'Tahoma',
                    color: 0x444444,
                    size: 11
                },
                dataTip: {
                    padding: 5,
                    border: {
                        color: 0x99bbe8,
                        size:1
                    },
                    background: {
                        color: 0xDAE7F6,
                        alpha: .9
                    },
                    font: {
                        name: 'Tahoma',
                        color: 0x15428B,
                        size: 10,
                        bold: true
                    }
                },
                xAxis: {
                    color: 0x69aBc8,
                    majorTicks: {color: 0x69aBc8, length: 4},
                    minorTicks: {color: 0x69aBc8, length: 2},
                    majorGridLines: {size: 1, color: 0xeeeeee}
                },
                yAxis: {
                    color: 0x69aBc8,
                    majorTicks: {color: 0x69aBc8, length: 4},
                    minorTicks: {color: 0x69aBc8, length: 2},
                    majorGridLines: {size: 1, color: 0xdfe8f6}
                }
            },
            series: [{
                type: 'column',
                displayName: 'Page Views',
                yField: 'views',
                style: {
                    image:'bar.gif',
                    mode: 'stretch',
                    color:0x99BBE8
                }
            },{
                type:'line',
                displayName: 'Visits',
                yField: 'visits',
                style: {
                    color: 0x15428B
                }
            }]
        }]
    });
}

Ext.extend(HistoricalStatisticsChartPortlet, Ext.FormPanel);