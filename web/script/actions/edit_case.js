Ext.namespace("SampleApp.EditCase");
var editCaseGridPanel;
var editCaseFormPanel;

var anywhere_store;

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
var netid_field;
var dns_field
var network_field;
var notes_field;
var category_field;
var verification_field;
var dsid_field;

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

SampleApp.EditCase.OpenFromGrid = function(dsid) {

    var editCasePanel = new SampleApp.EditCase.Panel();
    SampleApp.Main.CenterPanelInstance.add(editCasePanel);
    SampleApp.Main.CenterPanelInstance.activate(editCasePanel);

    dsid_field.setValue(dsid);
    
	var myData = Ext.Ajax.request({
	    url: 'controls/queries/get_case_info.php', //this needs to call the real service
	    waitTitle:'Connecting', 
	    waitMsg:'Getting data...',
	    params: {dsid: dsid},
	    
	    success:function(request){ 
	    	var obj = Ext.util.JSON.decode(request.responseText); 
	    	anywhere_store.loadData(obj);
	    	
	    	date_field.setValue(obj[0][1]);
	    	reporter_field.setValue(obj[0][2]);
	    	event_field.setValue(obj[0][3]);
	    	victim_field.setValue(obj[0][4]);
	    	attacker_field.setValue(obj[0][5]);
	    	netid_field.setValue(obj[0][6]);
	    	dns_field.setValue(obj[0][7]);
	    	network_field.setValue(obj[0][8]);
	    	dhcp_field.setValue(obj[0][9]);
	    	verification_field.setValue(obj[0][10]);
	    	notes_field.setValue(obj[0][11]);
	    	category_field.setValue(obj[0][12]);
	   },
	});
}

/**
 * 
 */
SampleApp.EditCase.Panel = function() {
	editCaseFormPanel = new SampleApp.EditCase.FormPanel();
    editCaseGridPanel = new SampleApp.EditCase.GridPanel();
    editCaseFromAnywhereGrid = new SampleApp.EditCase.FromAnywhereGrid();
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
					columnWidth:.59,
					style:'padding:10px 10 10px 10px',
					items:[{
						frame:true,         
						title: '50 Latest Cases',
						items: editCaseGridPanel,
					},
					{
						frame:true,         
						title: 'Results from last tab',
						items: editCaseFromAnywhereGrid,
						
					}]
					
	        	},
				{
					columnWidth:.39,
					style: 'padding:10px 5px 10px 10px',
					items: editCaseFormPanel,
					height: 720
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
	
	//break out form fields from the form so that we can add data to the object
	event_field = new Ext.form.TextField({
        fieldLabel: 'Event',
        name: 'event',
        width: 400,
        readOnly:true,
        allowBlank:false,
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
        width: 400,
        readOnly:true,
        allowBlank:false,
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
        readOnly:true,
        width: 400,
        allowBlank:false,
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
        allowBlank:false,
    });
    
    verification_field = new Ext.form.TextArea({
        fieldLabel: 'Verification',
        name: 'verification',
        width: 400,
        height: 250,
        allowBlank:false,
    });
    
    dsid_field = new Ext.form.Hidden({
    	xtype:'hidden',
        name:'dsid',
    });
    

    
    SampleApp.EditCase.FormPanel.superclass.constructor.call(this,{
        frame:false,
        buttonAlign : 'left',
        bodyStyle:'padding:5px 5px 0',
        width: 520,
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
                allowBlank:true,
                width: 400
            },
            verification_field,
            notes_field,
            category_field,
            dsid_field
        ],
        
        buttons: [{
            text: 'Update',   
            formBind: true,	 
            handler:function(){ 
            	var form_data = editCaseFormPanel.getForm().getValues();
            	if(editCaseFormPanel.getForm().isValid()) {
	            	Ext.Ajax.request({
	            		url: 'controls/actions/update_case.php',
				        method:'POST', 
				        waitTitle:'Connecting', 
				        waitMsg:'Getting data...',
				        params: form_data,
				        
				        success:function(request){ 
				        	var obj = Ext.util.JSON.decode(request.responseText);
				        	if(obj.success == "true") {
				        		Ext.Msg.alert('Case updated');
				        		
				        		//Update the grid when all is updated
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
				        	} else {
				        		Ext.Msg.alert('Case creation failed', obj.error); 
				        	}
				       },
					});
            	}
            },
        }],
        region: "north",
        height: 700
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
           {name: 'netid'},
           {name: 'dns'},
           {name: 'network'},
           {name: 'dhcp_info'},
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
                header   : 'NetID', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'netid'
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
                header   : 'DHCP', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'dhcp_info'
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
        height: 300,
		autoSizeColumns: true,
		listeners: {
			cellclick: function(grid, rowIndex, colIndex) {
				var rec = grid.getStore().getAt(rowIndex);
				
				//values pulled from the global form
				dsid_field.setValue(rec.get('dsid'));
				date_field.setValue(rec.get('date'));
				reporter_field.setValue(rec.get('analyst'));
				event_field.setValue(rec.get('event'));
				victim_field.setValue(rec.get('victim'));
				attacker_field.setValue(rec.get('attacker'));
				netid_field.setValue(rec.get('netid'));
				dns_field.setValue(rec.get('dns'));
				network_field.setValue(rec.get('network'));
				dhcp_field.setValue(rec.get('dhcp_info'));
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

/**
 * Grid Panel
 */
SampleApp.EditCase.FromAnywhereGrid = function() {
	
	// create the data store
    anywhere_store = new Ext.data.ArrayStore({
        fields: [
           {name: 'dsid'},	
           {name: 'date'},
           {name: 'analyst'},
           {name: 'event'},
           {name: 'victim'},
           {name: 'attacker'},
           {name: 'netid'},
           {name: 'dns'},
           {name: 'network'},
           {name: 'dhcp_info'},
           {name: 'user_verification'},
           {name: 'confirmation'},
           {name: 'report_category'}
        ]
    });
    
    SampleApp.EditCase.FromAnywhereGrid.superclass.constructor.call(this,{
        store: anywhere_store,
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
                header   : 'NetID', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'netid'
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
                header   : 'DHCP', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'dhcp_info'
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
        height: 200,
		autoSizeColumns: true,
		listeners: {
			cellclick: function(grid, rowIndex, colIndex) {
				var rec = grid.getStore().getAt(rowIndex);
				
				//values pulled from the global form
				dsid_field.setValue(rec.get('dsid'));
				date_field.setValue(rec.get('date'));
				reporter_field.setValue(rec.get('analyst'));
				event_field.setValue(rec.get('event'));
				victim_field.setValue(rec.get('victim'));
				attacker_field.setValue(rec.get('attacker'));
				netid_field.setValue(rec.get('netid'));
				dns_field.setValue(rec.get('dns'));
				network_field.setValue(rec.get('network'));
				dhcp_field.setValue(rec.get('dhcp_info'));
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
Ext.extend(SampleApp.EditCase.FromAnywhereGrid, Ext.grid.GridPanel, {
});