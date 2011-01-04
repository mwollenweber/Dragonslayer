Ext.namespace("SampleApp.DailyBadFiltered");
var dailyBadFilteredGridPanel;

/**
 * Attach the launcher panel to the West Panel
 */
Ext.onReady(function(){
    SampleApp.Main.EventRelay.on("openDailyBadFiltered",SampleApp.DailyBadFiltered.Open);
});

/**
 * Event handler
 */
SampleApp.DailyBadFiltered.Open = function() {
    var dailyBadFilteredPanel = new SampleApp.DailyBadFiltered.Panel();
    SampleApp.Main.CenterPanelInstance.add(dailyBadFilteredPanel);
    SampleApp.Main.CenterPanelInstance.activate(dailyBadFilteredPanel);
    
    SampleApp.Main.EventRelay.fireEvent("log",{
        severity: "info",
        from: "daily_bad_filtered.js",
        message: "Daily Bad Filtered Opened",
    });
}

/**
 * Create Daily Bad Filtered
 */
SampleApp.DailyBadFiltered.Panel = function() {
	dailyBadFilteredGridPanel = new SampleApp.DailyBadFiltered.GridPanel();
    SampleApp.DailyBadFiltered.Panel.superclass.constructor.call(this,{
        frame:true,
        title: "Daily MDL",
        closable:true,
        titleCollapse:true,
        layout: 'border',
        items : [
                 dailyBadFilteredGridPanel
        ]
    });
};

/**
 *   Daily Bad Filtered
 */
Ext.extend(SampleApp.DailyBadFiltered.Panel, Ext.Panel, {
});

/**
 * Grid Panel
 */
SampleApp.DailyBadFiltered.GridPanel = function() {
    
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
        url: 'controls/queries/daily_bad_filtered.php',
        method:'GET', 
        waitTitle:'Connecting', 
        waitMsg:'Getting data...',
        
        success:function(request){ 
        	var obj = Ext.util.JSON.decode(request.responseText); 
        	store.loadData(obj);
       },
	});
    
    SampleApp.DailyBadFiltered.GridPanel.superclass.constructor.call(this,{
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
Ext.extend(SampleApp.DailyBadFiltered.GridPanel, Ext.grid.GridPanel, {
});