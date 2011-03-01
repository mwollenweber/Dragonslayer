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
    
	var cm = new Ext.grid.ColumnModel([ 
        { header : 'Create case', width : 100, sortable : true, dataIndex: 'case'},
   		{ id :'daily_mdl_date', header : 'Date', width : 160, sortable : true, dataIndex: 'date' },
   		{ header : 'Event', width : 200, sortable : true, dataIndex: 'event' },
   		{ header : 'Victim', width : 120, sortable : true, dataIndex: 'victim', editor: new Ext.form.TextField({ allowBlank: false }) },
   		{ header : 'Attacker', width : 120, sortable : true, dataIndex: 'attacker', editor: new Ext.form.TextField({ allowBlank: false }) },
   		{ header : 'Notes', width : 170, sortable : true, dataIndex: 'notes'}
   	]);
   	cm.defaultSortable = true; 

   	var store = new Ext.data.JsonStore({
   	    fields: ['case','date','event','victim','attacker','notes']
   	});
   	
	reload_store = function() {
   		Ext.Ajax.request({
	   	    url: 'controls/queries/daily_mdl.php',
	   	    method:'GET', 
	   	    waitTitle:'Connecting', 
	   	    waitMsg:'Getting data...',
	   	    
	   	    success:function(request){ 
	   	    	var obj = Ext.util.JSON.decode(request.responseText); 
		    	time = new Date();
	//	    	hours = time.getHours();
	//	    	minutes = time.getMinutes();
	//	    	seconds = time.getSeconds();
	//	    	last_updated = hours + ":" + minutes + ":" + seconds;
		    	Ext.getCmp('dmdl_update_time').setText("Last updated: " + time);  
	   	    	store.loadData(obj);
	   	   },
	   	});
	}
    
	reload_store();
   	
   	dmdl_page_bar_update_time = new Ext.Toolbar.TextItem({
        text: '',
        id: 'dmdl_update_time',
	});
   	
   	dmdl_page_bar = new Ext.Toolbar({
		frame:false,
		items: [
		        dmdl_page_bar_update_time,
	        {
	        	text: 'Refresh',
	        	iconCls: 'x-tbar-loading',
	        	handler: function() {
	        		reload_store();
	        	}
	        }
    	]
	});
   	
   	SampleApp.DailyMdl.GridPanel.superclass.constructor.call(this,{
        region: 'center',
        store: store,
        tbar:[dmdl_page_bar],
        cm: cm,
        stripeRows: true,
        autoExpandColumn: 'daily_mdl_date',
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
			},
			cellcontextmenu: function(grid, rowIndex, colIndex, e) {
				var type = grid.getColumnModel().getDataIndex(colIndex);
				if(type == "analyst" || type == "event" || type == "victim" || type == "attacker" || type == "network"){
					var rec = grid.getStore().getAt(rowIndex);
				    var data = rec.get(type);
				    var search_context = new Ext.menu.Menu({
				    	items: [{
				    		text: 'search on ' + type,
				    		handler: function() {
				    			SampleApp.SearchByIp.PivotSearch(type, data)
				    		}
				    	}]
				    });

					search_context.showAt(e.getXY());
				}
			},
		    render: function() {
                 Ext.getBody().on("contextmenu", Ext.emptyFn, null, {preventDefault: true});
        	},
		}
    });
}

/**
 *  Grid Panel
 */
Ext.extend(SampleApp.DailyMdl.GridPanel, Ext.grid.GridPanel, {
});