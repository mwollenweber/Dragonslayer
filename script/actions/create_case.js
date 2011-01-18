Ext.namespace("SampleApp.CreateCase");
var createCaseFormPanel;
var createCaseGridPanel;
var network_name = '';
var date;
var dragon_event;
var victim;
var attacker;
var notes;

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
 * Call from grid
 */
SampleApp.CreateCase.OpenFromGrid = function(date,event,victim,attacker,notes) {
	//Assign values passed in from the grid to the global variables
	date = date;
	dragon_event = event;
	victim = victim;
	attacker = attacker;
	notes = notes;
	
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
	
	var ip_information = new Ext.data.JsonStore({
	    fields: ['critical_info','ip_addr','fqdn','dhcp_info','recent_case','network_name']
	});
	
	var myData = Ext.Ajax.request({
	    url: 'controls/queries/get_ip_info.json', //this needs to call the real service
	    waitTitle:'Connecting', 
	    waitMsg:'Getting data...',
	    
	    success:function(request){ 
	    	var obj = Ext.util.JSON.decode(request.responseText); 
	    	ip_information.loadData(obj.ip_msg);
	    	
	    	network_field.setValue(obj.ip_msg.network_name);
	    	dns_field.setValue(obj.ip_msg.fqdn);
	    	dhcp_field.setValue(obj.ip_msg.dhcp_info);
	   },
	});
	
	//break out form fields from the form so that we can add data to the object
	var event_field = new Ext.form.TextField({
        fieldLabel: 'Event',
        name: 'event',
        allowBlank:false,
        width: 400
    });
	
	var date_field = new Ext.form.TextField({
        fieldLabel: 'Date Discovered',
        name: 'date',
        allowBlank:false,
        width: 400
    });
	
	var reporter_field = new Ext.form.TextField({
        fieldLabel: 'Reporter',
        name: 'reporter',
        allowBlank:false,
        width: 400
    });
	
    var network_field = new Ext.form.TextField({
        fieldLabel: 'Network',
        name: 'network',
        allowBlank:false,
        width: 400
    });
    
    var netid_field = new Ext.form.TextField({
        fieldLabel: 'NetID',
        name: 'netid',
        allowBlank:false,
        width: 400
    });
    
    var victim_field = new Ext.form.TextField({
        fieldLabel: 'Victim',
        name: 'victim',
        allowBlank:false,
        width: 400
    });
    
    var attacker_field = new Ext.form.TextField({
        fieldLabel: 'Attacker',
        name: 'attacker',
        allowBlank:false,
        width: 400
    });
    
    var dhcp_field = new Ext.form.TextField({
        fieldLabel: 'DHCP',
        name: 'dhcp',
        allowBlank:false,
        width: 400
    });
    
    var dns_field = new Ext.form.TextField({
        fieldLabel: 'DNS',
        name: 'dns',
        allowBlank:false,
        width: 400
    });
    
    var notes_field = new Ext.form.TextArea({
        fieldLabel: 'Notes',
        name: 'notes',
        width: 400
    });
	
    
	//values pulled from the global form
	date_field.setValue(date);
	event_field.setValue(dragon_event);
	victim_field.setValue(victim);
	attacker_field.setValue(attacker);
	notes_field.setValue(notes);
    
    SampleApp.CreateCase.FormPanel.superclass.constructor.call(this,{
        frame:false,
        buttonAlign : 'left',
        bodyStyle:'padding:5px 5px 0',
        width: 600,
        defaultType: 'textfield',
        items: [
            event_field,
            reporter_field,
            victim_field,
            netid_field,
            network_field,
            dhcp_field,
            dns_field,
            attacker_field,
            date_field,
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
            notes_field,
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