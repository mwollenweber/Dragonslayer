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
        title: "Daily Bad Filtered",
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
    
	var cm = new Ext.grid.ColumnModel([ 
        { header : 'Create case', width : 100, sortable : true, dataIndex: 'case'},
   		{ id :'daily_bad_filter_date', header : 'Date', width : 160, sortable : true, dataIndex: 'date' },
   		{ header : 'Event', width : 200, sortable : true, dataIndex: 'event' },
   		{ header : 'Victim', width : 120, sortable : true, dataIndex: 'victim', editor: new Ext.form.TextField({ allowBlank: false }) },
   		{ header : 'Attacker', width : 120, sortable : true, dataIndex: 'attacker', editor: new Ext.form.TextField({ allowBlank: false }) },
   		{ header : 'Notes', width : 170, sortable : true, dataIndex: 'notes'}
   	]);
   	cm.defaultSortable = true; 

   	var store = new Ext.data.JsonStore({
   	    fields: ['case','date','event','victim','attacker','notes']
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
        cm: cm,
        stripeRows: true,
        autoExpandColumn: 'daily_bad_filter_date',
		autoSizeColumns: true,
		clicksToEdit: 1,
		listeners: {
			cellclick: function(grid, rowIndex, colIndex) {
				if (colIndex == 0) {
					var rec = grid.getStore().getAt(rowIndex);
					date = rec.get('date');
					event = rec.get('event');
					victim = rec.get('victim');
					attacker = rec.get('attacker');
					notes = rec.get('notes');
					SampleApp.CreateCase.OpenFromGrid(date,event,victim,attacker,notes);
				}
			}
		}
    });
}

/**
 *  Grid Panel
 */
Ext.extend(SampleApp.DailyBadFiltered.GridPanel, Ext.grid.EditorGridPanel, {
});