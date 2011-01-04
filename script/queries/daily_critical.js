Ext.namespace("SampleApp.DailyCritical");
var dailyCriticalGridPanel;

/**
 * Attach the launcher panel to the West Panel
 */
Ext.onReady(function(){
    SampleApp.Main.EventRelay.on("openDailyCritical",SampleApp.DailyCritical.Open);
});

/**
 * Event handler
 */
SampleApp.DailyCritical.Open = function() {
    var dailyCriticalPanel = new SampleApp.DailyCritical.Panel();
    SampleApp.Main.CenterPanelInstance.add(dailyCriticalPanel);
    SampleApp.Main.CenterPanelInstance.activate(dailyCriticalPanel);
    
    SampleApp.Main.EventRelay.fireEvent("log",{
        severity: "info",
        from: "daily_critical.js",
        message: "Daily Critical Opened",
    });
}

/**
 * Create Daily Bad Filtered
 */
SampleApp.DailyCritical.Panel = function() {
	dailyCriticalGridPanel = new SampleApp.DailyCritical.GridPanel();
    SampleApp.DailyCritical.Panel.superclass.constructor.call(this,{
        frame:true,
        title: "Daily Critical",
        closable:true,
        titleCollapse:true,
        layout: 'border',
        items : [
                 dailyCriticalGridPanel
        ]
    });
};

/**
 *   Daily Bad Filtered
 */
Ext.extend(SampleApp.DailyCritical.Panel, Ext.Panel, {
});

/**
 * Grid Panel
 */
SampleApp.DailyCritical.GridPanel = function() {
	SampleApp.DailyCritical.GridPanel.superclass.constructor.call(this,{
        loadMask: true,
        title: "djqwdjqwkld"
	});
    
	// create the data store
    var store = new Ext.data.ArrayStore({
        fields: [
           {name: 'date'},
           {name: 'event'},
           {name: 'victim'},
           {name: 'attacker'}
        ]
    });
    
    Ext.Ajax.timeout = 300000; 
    var myData = Ext.Ajax.request({
        url: 'controls/queries/daily_critical.php',
        method:'GET', 
        waitTitle:'Connecting', 
        waitMsg:'Getting data...',
        
        success:function(request){ 
        	var obj = Ext.util.JSON.decode(request.responseText); 
        	store.loadData(obj);
       },
	});
    
    SampleApp.DailyCritical.GridPanel.superclass.constructor.call(this,{
        region: 'center',
        store: store,
        columns: [
            {
                id       :'daily_critical_date',
                header   : 'Date', 
                width    : 160, 
                sortable : true, 
                dataIndex: 'date'
            },
            {
                header   : 'Event', 
                width    : 200, 
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
                width    : 120, 
                sortable : true, 
                dataIndex: 'attacker'
            }
        ],
        stripeRows: true,
        autoExpandColumn: 'daily_critical_date'
    });
}

/**
 *  Grid Panel
 */
Ext.extend(SampleApp.DailyCritical.GridPanel, Ext.grid.GridPanel, {
});