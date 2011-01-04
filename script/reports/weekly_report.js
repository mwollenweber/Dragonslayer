Ext.namespace("SampleApp.WeeklyReport");
var weeklyReportGridPanel;
var weeklyReportFormPanel;

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

/**
 * 
 */
SampleApp.WeeklyReport.Panel = function() {
    weeklyReportFormPanel = new SampleApp.WeeklyReport.FormPanel();
	weeklyReportGridPanel = new SampleApp.WeeklyReport.GridPanel();
	
    SampleApp.WeeklyReport.Panel.superclass.constructor.call(this,{
        frame:true,
        title: "Weekly Report",
        id: 'container',
        closable:true,
        titleCollapse:true,
        layout: 'border',
        items : [
                 weeklyReportGridPanel,
                 weeklyReportFormPanel
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
        autoExpandColumn: 'weekly_report_device'
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
    SampleApp.WeeklyReport.FormPanel.superclass.constructor.call(this,{
        frame:false,
        title: 'Weekly Report Graph',
        bodyStyle:'padding:5px 5px 0',
        id: 'weekly_report_chart_container',
        region: "south",
        height: 300,
        width: 800
    })
}

/**
 * 
 */
Ext.extend(SampleApp.WeeklyReport.FormPanel, Ext.FormPanel, {
});

