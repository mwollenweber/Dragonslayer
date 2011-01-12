Ext.namespace("SampleApp.CreateCase");
var createCaseFormPanel;
var createCaseGridPanel;

/**
 * Attach the launcher panel to the West Panel
 */
Ext.onReady(function(){
    SampleApp.Main.EventRelay.on("openCreateCase",SampleApp.CreateCase.Open);
});

/**
 * Event handler
 */
SampleApp.CreateCase.Open = function() {
    var createCasePanel = new SampleApp.CreateCase.Panel();
    SampleApp.Main.CenterPanelInstance.add(createCasePanel);
    SampleApp.Main.CenterPanelInstance.activate(createCasePanel);
    
    SampleApp.Main.EventRelay.fireEvent("log",{
        severity: "info",
        from: "create_case.js",
        message: "Create Case opened",
    });
}

/**
 * 
 */
SampleApp.CreateCase.Panel = function() {
	
    createCaseFormPanel = new SampleApp.CreateCase.FormPanel();
    SampleApp.CreateCase.Panel.superclass.constructor.call(this,{
        frame:true,
        title: "Create Case",
        closable:true,
        titleCollapse:true,
        layout: 'border',
        items : [
                 createCaseFormPanel
        ]
    });
};

/**
 * 
 */
Ext.extend(SampleApp.CreateCase.Panel, Ext.Panel, {
});

/**
 *
 */
SampleApp.CreateCase.FormPanel = function(){
	
	SampleApp.CreateCase.categories = [
	                          [200, 'Normal'],
	                          [201, 'Normal - Remedied'],
	                          [20, 'Student'],
	                          [300, 'Server'],
	                          [42, 'Needs Research'],
	                          [100, 'Other - Do Not Ticket'],
	                          [252, 'Other - Please Review'],
	                          [250, 'VIP - Please Review'],
	                          [251, 'VIP - Block/Re-image'],	
	                          [253, 'Request Review'],
	                          [500, 'Needs Forensics'],
	                          [510, 'Forensics Ongoing'],
	                          [520, 'Forensics Complete'],
	                          [0, 'Delete'],
	                      ];
	
    SampleApp.CreateCase.FormPanel.superclass.constructor.call(this,{
        frame:false,
        buttonAlign : 'left',
        bodyStyle:'padding:5px 5px 0',
        width: 600,
        defaultType: 'textfield',
        items: [{
                fieldLabel: 'Event',
                name: 'event',
                allowBlank:false,
                width: 400
            },
            {
                fieldLabel: 'Reporter',
                name: 'reporter',
                allowBlank:false,
                width: 400
            },
            {
                fieldLabel: 'IP Address',
                name: 'ip_address',
                allowBlank:false,
                width: 400
            },
            {
                fieldLabel: 'Victim',
                name: 'victim',
                allowBlank:false,
                width: 400
            },
            {
                fieldLabel: 'NetID',
                name: 'netid',
                allowBlank:false,
                width: 400
            },
            {
                fieldLabel: 'Network',
                name: 'network',
                allowBlank:false,
                width: 400
            },
            {
                fieldLabel: 'DHCP',
                name: 'dhcp',
                allowBlank:false,
                width: 400
            },
            {
                fieldLabel: 'DNS',
                name: 'dns',
                allowBlank:false,
                width: 400
            },
            {
                fieldLabel: 'Attacker',
                name: 'attacker',
                allowBlank:false,
                width: 400
            },
            new Ext.form.DateField({
                fieldLabel: 'Detection Date',
                name: 'detection_date',
                allowBlank:false,
                width: 400
            }),
            new Ext.form.TimeField({
                fieldLabel: 'Detection Time',
                name: 'detection_time',
                width: 400
            }),
            {
                fieldLabel: 'Primary Detection',
                name: 'primary_detection',
                allowBlank:false,
                width: 400
            },
            {
                fieldLabel: 'Seconday Detection',
                name: 'seconday_detection',
                allowBlank:false,
                width: 400
            },
            new Ext.form.TextArea({
                fieldLabel: 'Verification',
                name: 'verification',
                width: 400
            }),
            new Ext.form.TextArea({
                fieldLabel: 'Notes',
                name: 'notes',
                width: 400
            }),
            new Ext.form.ComboBox({
                fieldLabel: 'Category',
                name: 'category',
                width: 400,
                store: new Ext.data.ArrayStore({
                    fields: ['code', 'category'],
                    data : SampleApp.CreateCase.categories
                }),
                valueField:'code',
                displayField:'category',
                typeAhead: true,
                mode: 'local',
                triggerAction: 'all',
                emptyText:'Select a category...',
            }),
        ],

        buttons: [{
            text: 'Submit',   
            formBind: true,	 
            handler:function(){ 
            	var form_data = createCaseFormPanel.getForm().getValues();
            	Ext.Ajax.request({
            		url: 'controls/actions/create_case.php',
			        method:'POST', 
			        waitTitle:'Connecting', 
			        waitMsg:'Getting data...',
			        params: form_data,
			        
			        success:function(request){ 
			        	var obj = Ext.util.JSON.decode(request.responseText);
			        	if(obj.success == "true") {
			        		Ext.Msg.alert('Case created');
			        	} else {
			        		Ext.Msg.alert('Case creation failed', obj.error); 
			        	}
			       },
				});
            },
        }],
        region: "north",
        height: 600
    });
}

Ext.extend(SampleApp.CreateCase.FormPanel, Ext.FormPanel, {
});