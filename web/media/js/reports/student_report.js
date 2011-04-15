Ext.namespace("SampleApp.StudentReport");
var studentReportGridPanel;

/**
 * Attach the launcher panel to the West Panel
 */
Ext.onReady(function(){
    SampleApp.Main.EventRelay.on("openStudentReport",SampleApp.StudentReport.Open);
});

/**
 * Event handler
 */
SampleApp.StudentReport.Open = function() {
    var StudentReportPanel = new SampleApp.StudentReport.Panel();
    SampleApp.Main.CenterPanelInstance.add(StudentReportPanel);
    SampleApp.Main.CenterPanelInstance.activate(StudentReportPanel);
    
    SampleApp.Main.EventRelay.fireEvent("log",{
        severity: "info",
        from: "student_report.js",
        message: "Student Report Opened",
    });
}

/**
 * Create Daily Bad Filtered
 */
SampleApp.StudentReport.Panel = function() {
	studentReportGridPanel = new SampleApp.StudentReport.GridPanel();
    SampleApp.StudentReport.Panel.superclass.constructor.call(this,{
        frame:true,
        title: "Student Report",
        closable:true,
        titleCollapse:true,
        layout: 'border',
        items : [
                 studentReportGridPanel
        ]
    });
};

/**
 *   Daily Bad Filtered
 */
Ext.extend(SampleApp.StudentReport.Panel, Ext.Panel, {
});

/**
 * Grid Panel
 */
SampleApp.StudentReport.GridPanel = function() {
	
	var cm = new Ext.grid.ColumnModel([ 
     		{ header : 'Discovered', width : 160, sortable : true, dataIndex: 'discovered' },
     		{ header : 'IP', width : 200, sortable : true, dataIndex: 'victim' },
     		{ header : 'Event', width : 120, sortable : true, dataIndex: 'event'},
     		{ header : 'Notes', width : 120, sortable : true, dataIndex: 'notes'},
     		{ header : 'Verification', width : 170, sortable : true, dataIndex: 'verification', id: 'student_report_verification'},
     	]);
	cm.defaultSortable = true; 
      
  	var store = new Ext.data.JsonStore({
  	    fields: ['discovered','victim','event','notes','verification']
  	});
	
    var myData = Ext.Ajax.request({
        url: '/student_report/',
        method:'GET', 
        waitTitle:'Connecting', 
        waitMsg:'Getting data...',
        
        success:function(request){ 
        	var obj = Ext.util.JSON.decode(request.responseText); 
        	store.loadData(obj.data);
       },
	});
    
    SampleApp.StudentReport.GridPanel.superclass.constructor.call(this,{
        region: 'center',
        store: store,
        cm: cm,
        stripeRows: true,
        frame: true,
        autoExpandColumn: 'student_report_verification'
    });
}

/**
 *  Grid Panel
 */
Ext.extend(SampleApp.StudentReport.GridPanel, Ext.grid.GridPanel, {
});