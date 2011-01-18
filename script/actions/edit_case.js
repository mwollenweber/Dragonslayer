Ext.namespace("SampleApp.EditCase");
var editCaseGridPanel;
var editCaseFormPanel;

var dsid;
var date;
var analyst;
var dragon_event;
var victim;
var attacker;
var dns_name;
var network_name;
var confirmation;
var category;

var date_field;
var event_field;
var reporter_field;
var victim_field;
var attacker_field;
var dns_field
var network_field;
var notes_field;
var category_field;
var verification_field;

/**
 * Attach the launcher panel to the West Panel
 */
Ext.onReady(function(){
    SampleApp.Main.EventRelay.on("openEditCase",SampleApp.EditCase.Open);
});

/**
 * Event handler
 */
SampleApp.EditCase.Open = function() {
    var editCasePanel = new SampleApp.EditCase.Panel();
    SampleApp.Main.CenterPanelInstance.add(editCasePanel);
    SampleApp.Main.CenterPanelInstance.activate(editCasePanel);
    
    SampleApp.Main.EventRelay.fireEvent("log",{
        severity: "info",
        from: "edit_case.js",
        message: "Edit Case opened",
    });
}

/**
 * 
 */
SampleApp.EditCase.Panel = function() {
	editCaseFormPanel = new SampleApp.EditCase.FormPanel();
    editCaseGridPanel = new SampleApp.EditCase.GridPanel();
    SampleApp.EditCase.Panel.superclass.constructor.call(this,{
        frame:true,
        layout: "fit",
        title:'Edit Case',
        closable: true,
        items: [{
			xtype:'portal',
			margins: '0 0 10 10',
			cmargins: '10 10 10 10' ,
			region:'center',
        	items: [
	            {  
					columnWidth:.69,
					style:'padding:10px 10 10px 10px',
					items: editCaseGridPanel,
					height: 800
	        	},
				{
					columnWidth:.29,
					style: 'padding:10px 5px 10px 10px',
					items: editCaseFormPanel
	        	}
        	]
    	}]
    });
};

/**
 * 
 */
Ext.extend(SampleApp.EditCase.Panel, Ext.Panel, {
});

/**
*
*/
SampleApp.EditCase.FormPanel = function(){
	SampleApp.EditCase.categories = [
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
        allowBlank:false,
        width: 400
    });
    
    victim_field = new Ext.form.TextField({
        fieldLabel: 'Victim',
        name: 'victim',
        allowBlank:false,
        width: 400
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
        width: 400
    });
    
    category_field = new Ext.form.ComboBox({
        fieldLabel: 'Category',
        name: 'category',
        width: 400,
        store: new Ext.data.ArrayStore({
            fields: ['code', 'category'],
            data : SampleApp.EditCase.categories
        }),
        valueField:'code',
        displayField:'category',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        emptyText:'Select a category...',
    });
    
    verification_field = new Ext.form.TextArea({
        fieldLabel: 'Verification',
        name: 'verification',
        width: 400
    });
    
    SampleApp.EditCase.FormPanel.superclass.constructor.call(this,{
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
            verification_field,
            notes_field,
            category_field
        ],
        
        buttons: [{
            text: 'Update',   
            formBind: true,	 
            handler:function(){ 
            	var form_data = editCaseFormPanel.getForm().getValues();
            	Ext.Ajax.request({
            		url: 'controls/actions/update_case.php',
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
        height: 500
    });
}

/**
*
*/
Ext.extend(SampleApp.EditCase.FormPanel, Ext.FormPanel, {
});

/**
 * Grid Panel
 */
SampleApp.EditCase.GridPanel = function() {
	
	// create the data store
    store = new Ext.data.ArrayStore({
        fields: [
           {name: 'dsid'},	
           {name: 'date'},
           {name: 'analyst'},
           {name: 'event'},
           {name: 'victim'},
           {name: 'attacker'},
           {name: 'dns'},
           {name: 'network'},
           {name: 'user_verification'},
           {name: 'confirmation'},
           {name: 'report_category'}
        ]
    });
	
    var myData = Ext.Ajax.request({
        url: 'controls/queries/last_50_cases.php',
        method:'GET', 
        waitTitle:'Connecting', 
        waitMsg:'Getting data...',
        
        success:function(request){ 
        	var obj = Ext.util.JSON.decode(request.responseText); 
        	store.loadData(obj);
       },
	});
    
    SampleApp.EditCase.GridPanel.superclass.constructor.call(this,{
        store: store,
        columns: [
	          {
	              header   : 'DSID', 
	              width    : 100, 
	              sortable : true, 
	              dataIndex: 'dsid'
	          },
            {
                header   : 'Date', 
                width    : 160, 
                sortable : true, 
                dataIndex: 'date'
            },
            {
                header   : 'Analyst', 
                width    : 200, 
                sortable : true, 
                dataIndex: 'analyst'
            },
            {
                header   : 'Event', 
                width    : 120, 
                sortable : true, 
                dataIndex: 'event'
            },
            {
                header   : 'Victim', 
                width    : 120, 
                sortable : true, 
                dataIndex: 'victim'
            },
            {
                header   : 'Attacker', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'attacker'
            },
            {
                header   : 'DNS', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'dns'
            },
            {
                header   : 'Network', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'network'
            },
            {
                header   : 'Verification', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'user_verification'
            },
            {
            	id		 : 'search_by_ip_confirmation',
                header   : 'Confirmation', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'confirmation'
            },
            {
                header   : 'Category', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'report_category'
            }
        ],
        stripeRows: true,
        autoExpandColumn: 'search_by_ip_confirmation',
        height: 700,
		autoSizeColumns: true,
		listeners: {
			cellclick: function(grid, rowIndex, colIndex) {
				var rec = grid.getStore().getAt(rowIndex);
				
				//values pulled from the global form
				date_field.setValue(rec.get('date'));
				reporter_field.setValue(rec.get('analyst'));
				event_field.setValue(rec.get('event'));
				victim_field.setValue(rec.get('victim'));
				attacker_field.setValue(rec.get('attacker'));
				dns_field.setValue(rec.get('dns'));
				network_field.setValue(rec.get('network'));
				verification_field.setValue(rec.get('user_verification'));
				notes_field.setValue(rec.get('confirmation'));
				category_field.setValue(rec.get('report_category'));
			}
		},
    });
}

/**
 *  Grid Panel
 */
Ext.extend(SampleApp.EditCase.GridPanel, Ext.grid.GridPanel, {
});