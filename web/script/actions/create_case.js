Ext.namespace("SampleApp.CreateCase");
var createCaseFormPanel;
var createCaseGridPanel;
var createCasePanel;
var network_name = '';
var date;
var dragon_event;
var victim;
var attacker;
var notes;

var date_field;
var event_field;
var reporter_field;
var victim_field;
var attacker_field;
var netid_field;
var dns_field
var network_field;
var notes_field;
var category_field;
var verification_field;
var dsid_field;

//var unenteredCasesPortlet = new UnenteredCasesPortlet();

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
    createCasePanel = new SampleApp.CreateCase.Panel();
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
    createCaseDragonInterface = new SampleApp.CreateCase.DragonInterface();
    SampleApp.CreateCase.Panel.superclass.constructor.call(this,{
        frame:true,
        layout: "fit",
        title:'Create Case',
        closable: true,
        items: [{
			xtype:'portal',
			margins: '0 0 10 10',
			cmargins: '10 10 10 10' ,
			region:'center',
        	items: [
	            {  
					columnWidth:.35,
					style:'padding:10px 10 10px 10px',
					items: createCaseFormPanel
	        	},
				{
					columnWidth:.64,
					style: 'padding:10px 5px 10px 10px',
					items: [
				        {
							frame:true,         
							title: 'Dragon Interface',
							items: createCaseDragonInterface,
							height: 700
						},
						{
							frame:true,         
							title: 'Cases to be Entered',
							items: unenteredCasesPortlet
						}
					]
	        	}
        	]
    	}]
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
	    url: '../code/psp/get_ip_info.psp', //this needs to call the real service
	    waitTitle:'Connecting', 
	    waitMsg:'Getting data...',
	    params: { 'ip': victim, type: 'json'},
	    
	    success:function(request){ 
	    	var obj = Ext.util.JSON.decode(request.responseText); 
	    	ip_information.loadData(obj.ip_msg);
	    	network_field.setValue(obj.ip_msg.network_name);
	    	dns_field.setValue(obj.ip_msg.fqdn);
	    	dhcp_field.setValue(obj.ip_msg.dhcp_info);
	    	if (obj.ip_msg.critical_info != "FALSE") {
	    		Ext.Msg.alert('Critical', 'This is a VIP machine!');
	    	}	    	
	    	if (obj.ip_msg.recent_case != "0") {
	    		Ext.Msg.alert('Critical', 'A case exists for this IP!');
	    	}
	   },
	});
	
	function get_ip_info(victim) {
		Ext.Ajax.request({
	    url: '../code/psp/get_ip_info.psp', //this needs to call the real service
	    waitTitle:'Connecting', 
	    waitMsg:'Getting data...',
	    params: { 'ip': victim, type: 'json'},
	    
	    success:function(request){ 
	    	var obj = Ext.util.JSON.decode(request.responseText); 
	    	ip_information.loadData(obj.ip_msg);
	    	network_field.setValue(obj.ip_msg.network_name);
	    	dns_field.setValue(obj.ip_msg.fqdn);
	    	dhcp_field.setValue(obj.ip_msg.dhcp_info);
	    	if (obj.ip_msg.critical_info != "FALSE") {
	    		Ext.Msg.alert('Critical', 'This is a VIP machine!');
	    	}	    	
	    	if (obj.ip_msg.recent_case != "0") {
	    		Ext.Msg.alert('Critical', 'A case exists for this IP!');
	    	}
	   },
	});
	}
	
	
	//break out form fields from the form so that we can add data to the object
	event_field = new Ext.form.TextField({
        fieldLabel: 'Event',
        name: 'event',
        allowBlank:false,
        width: 400
    });
	
	date_field = new Ext.form.TextField({
        fieldLabel: 'Date Discovered',
        name: 'date',
        allowBlank:false,
        width: 400
    });
	
	reporter_field = new Ext.form.TextField({
        fieldLabel: 'Reporter',
        name: 'reporter',
        allowBlank:false,
        width: 400
    });
	
    network_field = new Ext.form.TextField({
        fieldLabel: 'Network',
        name: 'network',
        allowBlank:false,
        width: 400
    });
    
    netid_field = new Ext.form.TextField({
        fieldLabel: 'NetID',
        name: 'netid',
        allowBlank:true,
        width: 400
    });
    
    victim_field = new Ext.form.TextField({
        fieldLabel: 'Victim',
        name: 'victim',
        allowBlank:false,
        width: 400,
        onBlur : function() {
        	get_ip_info(victim_field.getValue())
        }
    });
    
    attacker_field = new Ext.form.TextField({
        fieldLabel: 'Attacker',
        name: 'attacker',
        allowBlank:false,
        width: 400
    });
    
    dhcp_field = new Ext.form.TextField({
        fieldLabel: 'DHCP',
        name: 'dhcp',
        allowBlank:false,
        width: 400
    });
    
    dns_field = new Ext.form.TextField({
        fieldLabel: 'DNS',
        name: 'dns',
        allowBlank:false,
        width: 400
    });
    
    notes_field = new Ext.form.TextArea({
        fieldLabel: 'Notes',
        name: 'notes',
        width: 400,
        allowBlank:false,
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
                allowBlank:true,
                width: 400
            },
            {
                fieldLabel: 'Seconday Detection',
                name: 'seconday_detection',
                width: 400,
                allowBlank:true,
            },
            new Ext.form.TextArea({
                fieldLabel: 'Verification',
                name: 'verification',
                width: 400,
                allowBlank:false,
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
                allowBlank:false,
            }),
        ],

        buttons: [{
            text: 'Submit',   
            formBind: true,	 
            handler:function(){ 
            	var form_data = createCaseFormPanel.getForm().getValues();
            	if(createCaseFormPanel.getForm().isValid()){
	            	Ext.Ajax.request({
	            		url: 'controls/actions/create_case.php',
				        method:'POST', 
				        waitTitle:'Connecting', 
				        waitMsg:'Getting data...',
				        params: form_data,
				        
				        success:function(request){ 
				        	var obj = Ext.util.JSON.decode(request.responseText);
				        	if(obj.success == "true") {
				        		Ext.Msg.alert('Success','Case created');
				        		SampleApp.Main.CenterPanelInstance.remove(createCasePanel);
				        		createCaseFormPanel.getForm().reset();
				        	} else {
				        		Ext.Msg.alert('Case creation failed', obj.error); 
				        	}
				       },
					});
            	}
            },
        }],
        region: "north",
        height: 600
    });
}

Ext.extend(SampleApp.CreateCase.FormPanel, Ext.FormPanel, {
});

SampleApp.CreateCase.DragonInterface = function(){
	SampleApp.CreateCase.DragonInterface.superclass.constructor.call(this,{
        frame:true,
        html: "<iframe height=100% width=100% src='https://128.164.11.22:9443'></iframe>"
    });
};


Ext.extend(SampleApp.CreateCase.DragonInterface, Ext.Panel, {
});