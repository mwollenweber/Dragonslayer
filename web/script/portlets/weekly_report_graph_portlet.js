Ext.namespace("SampleApp.WeeklyReport");
var weeklyReportPortletFormPanel;
var chart;

WeeklyReportGraphPortlet = function() {

	var store_everything = new Ext.data.JsonStore({
        fields:['week_all', 'count_all','week_student', 'count_student', 'week_dit','count_dit'],
        url: 'controls/query.php?type=cases',
        root: "data",
    });
    
    var loadData = function(store){
        store.load();
    }

    var bindStore = function(store){
        chart.bindStore(store);
    }

    var addSeries = function(){
        var series = [{
            name: 'All',
            dataIndex: 'count_all',
            xField: 'week_all',
            yField: 'count_all',
        },{
            name: 'Student',
            dataIndex: 'count_student',
            xField: 'week_student',
            yField: 'count_student',
        },{
            name: 'DIT',
            dataIndex: 'count_dit',
            xField: 'week_dit',
            yField: 'count_dit',
        }];
        chart.addSeries(series);
    }
	
	chart = new Ext.ux.HighChart({
        chartConfig: {
            chart: {
                defaultSeriesType: 'line',
                margin: [50, 150, 60, 80]
            },
            title: {
                text: 'Weekly Cases',
                style: {
                    margin: '10px 100px 0 0' // center it
                }
            },
            xAxis: [{
            	title: {
            		text: 'Week'
            	},
				categories: ['0', '1', '2','3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
								'13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
                min:1,
                max:52
            
            }],
            yAxis: {
                title: {
                    text: 'Number of Cases'
                },
                min:0,
                max:250
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.series.name +'</b><br/>'+
                        this.y +' cases';
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
            }
        }
    });
	
    addSeries();
    bindStore(store_everything);
    loadData(store_everything);
	
    /**
     * Constructor for SearchByIpPortlet to return back the 2 created items into the portlet
     */
    WeeklyReportGraphPortlet.superclass.constructor.call(this, {
        frame:false,
        bodyStyle:'padding:5px 5px 0',
        height: 400,
        width: 800,
		loadMask:true,
        items: [chart]
    });
}

Ext.extend(WeeklyReportGraphPortlet, Ext.FormPanel);