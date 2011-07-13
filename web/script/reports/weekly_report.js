Ext.namespace("SampleApp.WeeklyReport");
var weeklyReportGridPanel;
var chart;

/**
 * Attach the launcher panel to the West Panel
 */
Ext.onReady(function(){
    SampleApp.Main.EventRelay.on("openWeeklyReport",SampleApp.WeeklyReport.Open);
});

/**
 * Event handler
 */
SampleApp.WeeklyReport.Open = function() {
    var weeklyReportPanel = new SampleApp.WeeklyReport.Panel();
    SampleApp.Main.CenterPanelInstance.add(weeklyReportPanel);
    SampleApp.Main.CenterPanelInstance.activate(weeklyReportPanel);
    
    SampleApp.Main.EventRelay.fireEvent("log",{
        severity: "info",
        from: "weekly_report.js",
        message: "Weekly Report Opened",
    });
}

var report_tools = [{
	id:'help',
	handler: function(e, target, panel){
		SampleApp.HelperDocs.Open(panel.id, hidden_user_field.getValue(), hidden_role_field.getValue());
	}
}];

/**
 * 
 */
SampleApp.WeeklyReport.Panel = function() {
    weeklyReportFormPanel = new SampleApp.WeeklyReport.FormPanel();
	weeklyReportGridPanel = new SampleApp.WeeklyReport.GridPanel();
	weeklyReportCountData = new SampleApp.WeeklyReport.CountData();
    SampleApp.WeeklyReport.Panel.superclass.constructor.call(this,{
        frame:true,
        title: "Weekly Report",
        closable:true,
        titleCollapse:true,
        layout: 'border',
        items : [
                 weeklyReportGridPanel,
                 weeklyReportCountData,
                 weeklyReportFormPanel,
        ]
    });
};

/**
 *   Daily Bad Filtered
 */
Ext.extend(SampleApp.WeeklyReport.Panel, Ext.Panel, {
});

/**
 * Grid Panel
 */
SampleApp.WeeklyReport.GridPanel = function() {
    
	// create the data store
    var store = new Ext.data.ArrayStore({
        fields: [
           {name: 'device'},
           {name: 'ip'},
           {name: 'department'},
           {name: 'date'},
           {name: 'patchlink'},
           {name: 'last_patchlink_check'},
           {name: 'notes'}
        ]
    });
	
    var myData = Ext.Ajax.request({
        url: 'controls/reports/weekly_report.php',
        method:'GET', 
        waitTitle:'Connecting', 
        waitMsg:'Getting data...',
        
        success:function(request){ 
        	var obj = Ext.util.JSON.decode(request.responseText); 
        	store.loadData(obj);
       },
	});
    
    SampleApp.WeeklyReport.GridPanel.superclass.constructor.call(this,{
        region: 'center',
        stateful:true,
        stateId: 'weekly_report_state',
        store: store,
        columns: [
            {
                id       :'weekly_report_device',
                header   : 'Device Name', 
                width    : 160, 
                sortable : true, 
                dataIndex: 'device'
            },
            {
                header   : 'IP', 
                width    : 200, 
                sortable : true, 
                dataIndex: 'ip'
            },
            {
                header   : 'School/Department', 
                width    : 120, 
                sortable : true, 
                dataIndex: 'department'
            },
            {
                header   : 'Date/Time', 
                width    : 120, 
                sortable : true, 
                dataIndex: 'date'
            },
            {
                header   : 'Patchlink', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'patchlink'
            },
            {
                header   : 'Last Patchlink Checkin', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'last_patchlink_check'
            },
            {
                header   : 'Notes', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'notes'
            }
        ],
        stripeRows: true,
        autoExpandColumn: 'weekly_report_device',
        frame: true,
        title: "Weekly Data",
        tools: report_tools,
        id: 't_weekly_report_data_helper_doc',
    });
}

/**
 *  Grid Panel
 */
Ext.extend(SampleApp.WeeklyReport.GridPanel, Ext.grid.GridPanel, {
});


/**
 *  Address Book Form Panel
 */
SampleApp.WeeklyReport.FormPanel = function(){
	
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

	
    SampleApp.WeeklyReport.FormPanel.superclass.constructor.call(this,{
        frame:true,
        title: 'Weekly Report Graph',
        bodyStyle:'padding:5px 5px 0',
        region: "south",
        height: 400,
        width: 800,
		loadMask:true,
        items: [chart],
        tools: report_tools,
        id: 't_weekly_report_chart_helper_doc',
    })
    
    addSeries();
    bindStore(store_everything);
    loadData(store_everything);

}

/**
 * 
 */
Ext.extend(SampleApp.WeeklyReport.FormPanel, Ext.FormPanel, {
});

SampleApp.WeeklyReport.CountData = function() {

	var cm = new Ext.grid.ColumnModel([ 
		{ header : 'Type', width : 50, sortable : true, dataIndex: 'type'},
		{ header : 'Amount', width : 50, sortable : true, dataIndex: 'count'}
	]);
	cm.defaultSortable = true; 

   	var store = new Ext.data.JsonStore({
   	    fields: ['type','count']
   	});
   	
   	var myData = Ext.Ajax.request({
   	    url: 'controls/reports/weekly_counts.php',
   	    method:'GET', 
   	    waitTitle:'Connecting', 
   	    waitMsg:'Getting data...',
   	    
   	    success:function(request){ 
   	    	var obj = Ext.util.JSON.decode(request.responseText); 
   	    	store.loadData(obj);
   	   },
   	});
	
    SampleApp.WeeklyReport.CountData.superclass.constructor.call(this,{
        store: store,
        cm: cm,
        stripeRows: true,
        height: 300,
        viewConfig: {forceFit: true},
		autoSizeColumns: true,
		loadMask: true,
        region: "west",
        frame: true,
        title: "Weekly Counts",
        width: 250,
        tools: report_tools,
        id: 't_weekly_report_count_helper_doc',
    })
}

Ext.extend(SampleApp.WeeklyReport.CountData, Ext.grid.GridPanel, {
});
