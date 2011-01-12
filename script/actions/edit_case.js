Ext.namespace("SampleApp.EditCase");
var editCaseGridPanel;


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
	
    editCaseGridPanel = new SampleApp.EditCase.GridPanel();
    SampleApp.EditCase.Panel.superclass.constructor.call(this,{
        frame:true,
        title: "Edit Case",
        closable:true,
        titleCollapse:true,
        layout: 'border',
        items : [
                 editCaseGridPanel
        ]
    });
};

/**
 * 
 */
Ext.extend(SampleApp.EditCase.Panel, Ext.Panel, {
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
           {name: 'confirmation'}
        ]
    });
    
    SampleApp.EditCase.GridPanel.superclass.constructor.call(this,{
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
Ext.extend(SampleApp.EditCase.GridPanel, Ext.grid.GridPanel, {
});