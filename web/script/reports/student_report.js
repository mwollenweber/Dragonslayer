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

var report_tools = [{
	id:'help',
	handler: function(e, target, panel){
		SampleApp.HelperDocs.Open(panel.id, hidden_user_field.getValue(), hidden_role_field.getValue());
	}
}];

/**
 * Create Daily Bad Filtered
 */
SampleApp.StudentReport.Panel = function() {
	studentReportGridPanel = new SampleApp.StudentReport.GridPanel();
    SampleApp.StudentReport.Panel.superclass.constructor.call(this,{
        frame:true,
        title: "Student Report",
        tools: report_tools,
        id: 't_student_report_helper_doc',
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
    
	// create the data store
    var store = new Ext.data.ArrayStore({
        fields: [
           {name: 'discovered'},
           {name: 'ip'},
           {name: 'event'},
           {name: 'notes'},
           {name: 'verification'}
        ]
    });
	
    var myData = Ext.Ajax.request({
        url: 'controls/reports/student_report.php',
        method:'GET', 
        waitTitle:'Connecting', 
        waitMsg:'Getting data...',
        
        success:function(request){ 
        	var obj = Ext.util.JSON.decode(request.responseText); 
        	store.loadData(obj);
       },
	});
    
    SampleApp.StudentReport.GridPanel.superclass.constructor.call(this,{
        region: 'center',
        store: store,
        stateful:true,
        stateId: 'student_report_state',
        columns: [
            {
                header   : 'Discovered', 
                width    : 160, 
                sortable : true, 
                dataIndex: 'discovered'
            },
            {
                header   : 'IP', 
                width    : 200, 
                sortable : true, 
                dataIndex: 'ip'
            },
            {
                header   : 'Event', 
                width    : 120, 
                sortable : true, 
                dataIndex: 'event'
            },
            {
                header   : 'Notes', 
                width    : 120, 
                sortable : true, 
                dataIndex: 'notes'
            },
            {
            	id		 : 'student_report_verification',
                header   : 'Verification', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'verification'
            }
        ],
        stripeRows: true,
        autoExpandColumn: 'student_report_verification'
    });
}

/**
 *  Grid Panel
 */
Ext.extend(SampleApp.StudentReport.GridPanel, Ext.grid.GridPanel, {
});