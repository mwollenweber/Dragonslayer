Ext.namespace("SampleApp.SearchByIp");
var searchByIpFormPanel;
var searchByIpGridPanel;
var store;

/**
 * Attach the launcher panel to the West Panel
 */
Ext.onReady(function(){
    SampleApp.Main.EventRelay.on("openSearchByIp",SampleApp.SearchByIp.Open);
});

/**
 * Event handler
 */
SampleApp.SearchByIp.Open = function() {
    var searchByIpPanel = new SampleApp.SearchByIp.Panel();
    SampleApp.Main.CenterPanelInstance.add(searchByIpPanel);
    SampleApp.Main.CenterPanelInstance.activate(searchByIpPanel);
    
    SampleApp.Main.EventRelay.fireEvent("log",{
        severity: "info",
        from: "search_by_ip.js",
        message: "Search by IP opened",
    });
}

/**
 * 
 */
SampleApp.SearchByIp.Panel = function() {
	
    searchByIpFormPanel = new SampleApp.SearchByIp.FormPanel();
    searchByIpGridPanel = new SampleApp.SearchByIp.GridPanel();
    SampleApp.SearchByIp.Panel.superclass.constructor.call(this,{
        frame:true,
        title: "Search by IP Address",
        closable:true,
        titleCollapse:true,
        layout: 'border',
        items : [
                 searchByIpFormPanel,	
                 searchByIpGridPanel
        ]
    });
};

/**
 * 
 */
Ext.extend(SampleApp.SearchByIp.Panel, Ext.Panel, {
});

/**
 *
 */
SampleApp.SearchByIp.FormPanel = function(){
    SampleApp.SearchByIp.FormPanel.superclass.constructor.call(this,{
        frame:false,
        buttonAlign : 'left',
        bodyStyle:'padding:5px 5px 0',
        width: 500,
        defaultType: 'textfield',
        items: [{
                fieldLabel: 'IP Address',
                name: 'ip_address',
                allowBlank:false
            },
        ],

        buttons: [{
            text: 'Search',   
            formBind: true,	 
            handler:function(){ 
            	var form_data = searchByIpFormPanel.getForm().getValues();
            	Ext.Ajax.request({
            		url: 'controls/actions/search_by_ip.php',
			        method:'POST', 
			        waitTitle:'Connecting', 
			        waitMsg:'Getting data...',
			        params: form_data,
			        
			        success:function(request){ 
			        	var obj = Ext.util.JSON.decode(request.responseText);
			        	store.loadData(obj);
			       },
				});
            },
        }],
        region: "north",
        height: 100
    });
}

/**
 *
 */
Ext.extend(SampleApp.SearchByIp.FormPanel, Ext.FormPanel, {
});

/**
 * Grid Panel
 */
SampleApp.SearchByIp.GridPanel = function() {
    
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
           {name: 'confirmation'}
        ]
    });
    
    SampleApp.SearchByIp.GridPanel.superclass.constructor.call(this,{
        region: 'center',
        store: store,
        columns: [
            {
                header   : 'DSID', 
                width    : 160, 
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
            	id		 : 'search_by_ip_confirmation',
                header   : 'Confirmation', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'confirmation'
            }
        ],
        stripeRows: true,
        autoExpandColumn: 'search_by_ip_confirmation'
    });
}

/**
 *  Grid Panel
 */
Ext.extend(SampleApp.SearchByIp.GridPanel, Ext.grid.GridPanel, {
});