Ext.namespace("SampleApp.DailyMdl");
var dailyMdlGridPanel;

/**
 * Attach the launcher panel to the West Panel
 */
Ext.onReady(function(){
    SampleApp.Main.EventRelay.on("openDailyMdl",SampleApp.DailyMdl.Open);
});

/**
 * Event handler
 */
SampleApp.DailyMdl.Open = function() {
    var dailyMdlPanel = new SampleApp.DailyMdl.Panel();
    SampleApp.Main.CenterPanelInstance.add(dailyMdlPanel);
    SampleApp.Main.CenterPanelInstance.activate(dailyMdlPanel);
    
    SampleApp.Main.EventRelay.fireEvent("log",{
        severity: "info",
        from: "daily_mdl.js",
        message: "Daily MDL Opened",
    });
}

/**
 * Create Daily Bad Filtered
 */
SampleApp.DailyMdl.Panel = function() {
	dailyMdlGridPanel = new SampleApp.DailyMdl.GridPanel();
    SampleApp.DailyMdl.Panel.superclass.constructor.call(this,{
        frame:true,
        title: "Daily MDL",
        closable:true,
        titleCollapse:true,
        layout: 'border',
        items : [
                 dailyMdlGridPanel
        ]
    });
};

/**
 *   Daily Bad Filtered
 */
Ext.extend(SampleApp.DailyMdl.Panel, Ext.Panel, {
});

/**
 * Grid Panel
 */
SampleApp.DailyMdl.GridPanel = function() {
    
	// create the data store
    var store = new Ext.data.ArrayStore({
        fields: [
           {name: 'date'},
           {name: 'event'},
           {name: 'victim'},
           {name: 'attacker'},
           {name: 'notes'}
        ]
    });
	
    var myData = Ext.Ajax.request({
        url: 'controls/queries/daily_mdl.php',
        method:'GET', 
        waitTitle:'Connecting', 
        waitMsg:'Getting data...',
        
        success:function(request){ 
        	var obj = Ext.util.JSON.decode(request.responseText); 
        	store.loadData(obj);
       },
	});
    
    SampleApp.DailyMdl.GridPanel.superclass.constructor.call(this,{
        region: 'center',
        store: store,
        columns: [
            {
                id       :'date',
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
            },
            {
                header   : 'Notes', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'notes'
            }
        ],
        stripeRows: true,
        autoExpandColumn: 'date'
    });
}

/**
 *  Grid Panel
 */
Ext.extend(SampleApp.DailyMdl.GridPanel, Ext.grid.GridPanel, {
});