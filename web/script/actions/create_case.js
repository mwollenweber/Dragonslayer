/**
 * @author Brandon Dixon
 * @date 01/19/2011
 * @description Creates a case
 */

Ext.namespace("SampleApp.CreateCase");

//define variables to be used all over
var createCaseFormPanel;
var createCaseGridPanel;
var createCasePanel;
var ip_information;
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

/**
 * When clicked, fire the open action
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
}

//registers the helper docs to this panel
var action_tools = [{
	id:'help',
	handler: function(e, target, panel){
		SampleApp.HelperDocs.Open(panel.id, hidden_user_field.getValue(), hidden_role_field.getValue());
	}
}];

/**
 * Call from grid - this assumes the user made it to create case by clickin on the "+" within one of the portlet grids
 * @input takes in all the data from the grid component
 */
SampleApp.CreateCase.OpenFromGrid = function(date,event,victim,attacker,notes) {

    var createCasePanel = new SampleApp.CreateCase.Panel();
    get_ip_info(victim)
	date_field.setValue(date);
	event_field.setValue(event);
	victim_field.setValue(victim);
	attacker_field.setValue(attacker);
	notes_field.setValue(notes);
    SampleApp.Main.CenterPanelInstance.add(createCasePanel);
    SampleApp.Main.CenterPanelInstance.activate(createCasePanel);
}

/**
 * Main CreateCase Panel
 */
SampleApp.CreateCase.Panel = function() {
    createCaseFormPanel = new SampleApp.CreateCase.FormPanel(); //form panel to enter data
    createCaseDragonInterface = new SampleApp.CreateCase.DragonInterface(); //iframe to load Dragon IDS
    
    SampleApp.CreateCase.Panel.superclass.constructor.call(this,{
        frame:true,
        layout: "fit",
        title:'Create Case',
        id: 't_create_case_tab_heldoc',
        closable: true,
        tools: action_tools,
        items: [{
			xtype:'portal',
			margins: '0 0 10 10',
			cmargins: '10 10 10 10' ,
			region:'center',
        	items: [
	            {  
					columnWidth:.35,
					style:'padding:10px 10 10px 10px',
					items: createCaseFormPanel,
	        	},
				{
					columnWidth:.64,
					style: 'padding:10px 5px 10px 10px',
					items: [
				        {
							frame:true,         
							title: 'Dragon Interface',
							items: createCaseDragonInterface, //dragon iframe
							height: 700
						},
						{
							frame:true,         
							title: 'Cases to be Entered',
							items: unenteredCasesPortlet //portlet that monitors DBF and updates with cases still to be entered
						}
					]
	        	}
        	]
    	}]
    });
};

/**
 * CreateCase Panel Register
 */
Ext.extend(SampleApp.CreateCase.Panel, Ext.Panel, {
});

/**
 * @description uses Matt's service to grab data we need for a particular IP address
 * @param victim (ip address)
 * @return JSON object with data about the IP
 * @notes should be part of a util class
 */
function get_ip_info(victim) {
	Ext.Ajax.request({
	    url: '../code/psp/get_ip_info.psp', //this should be something more conventional
	    waitTitle:'Connecting', 
	    waitMsg:'Getting data...',
	    params: { 'ip': victim, type: 'json'},
	    
	    success:function(request){ 
	    	var obj = Ext.util.JSON.decode(request.responseText); 
	    	ip_information.loadData(obj.ip_msg);
	    	if(obj.ip_msg.ip_addr.length > 4) {
		    	network_field.setValue(obj.ip_msg.network_name);
		    	dns_field.setValue(obj.ip_msg.fqdn);
		    	dhcp_field.setValue(obj.ip_msg.dhcp_info);
		    	if (obj.ip_msg.critical_info != "FALSE") {
		    		Ext.Msg.alert('Critical', 'This is a VIP machine!');
		    	}	    	
		    	if (obj.ip_msg.recent_case != "0") {
		    		Ext.Msg.alert('Critical', 'A case exists for this IP!');
		    	}
		    	if (obj.ip_msg.ip_alert != "FALSE") {
		    		Ext.Msg.alert('Critical', obj.ip_msg.ip_alert);
		    	}
	    	}
	   },
	});
}

/**
 * Form panel to show to the user
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
	                          [25, 'Mail Compromise - Student'],
	                          [205, 'Mail Compromise - Faculty/Staff'],
	                          [0, 'Delete'],
	                      ];
	
	ip_information = new Ext.data.JsonStore({
	    fields: ['critical_info','ip_addr','fqdn','dhcp_info','recent_case','network_name']
	});
	
	/**
	 * snatch_user
	 * @description get the user for the current session and fill it in for the analyst field
	 */
	function snatch_user() {
		Ext.Ajax.request({
		    url: 'controls/authentication/snatch_user.php',
		    waitTitle:'Connecting', 
		    waitMsg:'Getting data...',
		    
		    success:function(request){ 
		    	var obj = Ext.util.JSON.decode(request.responseText); 
		    	reporter_field.setValue(obj.user);
		   },
		})
	}
	
	//break out form fields from the form so that we can add data to the object
	event_field = new Ext.form.TextField({
        fieldLabel: 'Event',
        name: 'event',
        allowBlank:false,
        anchor:'100%'
    });
	
	date_field = new Ext.form.TextField({
        fieldLabel: 'Date Discovered',
        name: 'date',
        allowBlank:false,
        anchor:'100%'
    });
	
	reporter_field = new Ext.form.TextField({
        fieldLabel: 'Reporter',
        name: 'reporter',
        allowBlank:false,
        anchor:'100%'
    });
	
    network_field = new Ext.form.TextField({
        fieldLabel: 'Network',
        name: 'network',
        allowBlank:false,
        anchor:'100%'
    });
    
    netid_field = new Ext.form.TextField({
        fieldLabel: 'NetID',
        name: 'netid',
        allowBlank:true,
        anchor:'100%'
    });
    
    victim_field = new Ext.form.TextField({
        fieldLabel: 'Victim',
        name: 'victim',
        allowBlank:false,
        onBlur : function() {
        	get_ip_info(victim_field.getValue())
        },
        anchor:'100%'
    });
    
    attacker_field = new Ext.form.TextField({
        fieldLabel: 'Attacker',
        name: 'attacker',
        allowBlank:false,
        anchor:'100%'
    });
    
    dhcp_field = new Ext.form.TextField({
        fieldLabel: 'DHCP',
        name: 'dhcp',
        allowBlank:false,
        anchor:'100%'
    });
    
    dns_field = new Ext.form.TextField({
        fieldLabel: 'DNS',
        name: 'dns',
        allowBlank:false,
        anchor:'100%'
    });
    
    notes_field = new Ext.form.TextArea({
        fieldLabel: 'Notes',
        name: 'notes',
        allowBlank:false,
        anchor:'100%'
    });
	
    verification_field = new Ext.form.TextArea({
        fieldLabel: 'Verification',
        name: 'verification',
        height: 250,
        allowBlank:false,
        anchor:'100%'
    });
    
	//values pulled from the global form
	snatch_user();
    
    new Ext.KeyMap(Ext.get(document), { // hotkey to so that CTRL+Q will fill in data (helpful on bulk entry)
    	key:'Q',
    	ctrl:true,
    	fn:function(e) {
			date_field.setValue('1');
			event_field.setValue('ren-isac-soc');
			verification_field.setValue('Reported from REN-ISAC emailer')
			notes_field.setValue('DNS Changer callback reported by Ren-ISAC');
    	},
    	stopEvent:true
	});
    
    SampleApp.CreateCase.FormPanel.superclass.constructor.call(this,{
        frame:false,
        buttonAlign : 'left',
        bodyStyle:'padding:5px 5px 0',
        defaultType: 'textfield',
        autoWidth: true,
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
                anchor:'100%'
            },
            {
                fieldLabel: 'Seconday Detection',
                name: 'seconday_detection',
                allowBlank:true,
                anchor:'100%'
            },
            verification_field,
            notes_field,
            new Ext.form.ComboBox({
                fieldLabel: 'Category',
                name: 'category',
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
                anchor:'100%'
            }),
        ],

        buttons: [{
            text: 'Submit',   
            formBind: true,	 
            handler:function(){ //call back to the server with the user data to create a case
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
				        		Ext.Msg.alert('Success','Case created (dsid: ' + obj.id + ' )');
//				        		SampleApp.Main.CenterPanelInstance.remove(createCasePanel);
				        		createCaseFormPanel.getForm().reset();
				        		date_field.setValue(''); //clear out manually
				        		event_field.setValue('');
				        		victim_field.setValue('');
				        		attacker_field.setValue('');
				        		notes_field.setValue('');
				        	} else {
				        		Ext.Msg.alert('Case creation failed', obj.error); 
				        	}
				       },
					});
            	}
            },
        },
        {
        	text: 'Reset',
        	formBind: true,
        	handler:function(){ 
        		createCaseFormPanel.getForm().reset();
        	}
        }],
        region: "north",
        height: 720,
    });
}

Ext.extend(SampleApp.CreateCase.FormPanel, Ext.FormPanel, {
});

SampleApp.CreateCase.DragonInterface = function(){
	SampleApp.CreateCase.DragonInterface.superclass.constructor.call(this,{
        frame:true,
        html: "<iframe height=100% width=100% src='https://128.164.11.22:9443'></iframe>" //this is hacky, but it works and Dragon should die soon
    });
};


Ext.extend(SampleApp.CreateCase.DragonInterface, Ext.Panel, {
});
