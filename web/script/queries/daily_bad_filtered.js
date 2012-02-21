Ext.namespace("SampleApp.DailyBadFiltered");
var dailyBadFilteredGridPanel;
var reload_store;

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

//register the helper docs and ability to refresh the table
var tools = [{
	id:'help',
	handler: function(e, target, panel){
		SampleApp.HelperDocs.Open(panel.id, hidden_user_field.getValue(), hidden_role_field.getValue());
	}
},{
	id:'refresh',
	handler: function(e, target, panel){
		reload_store();
	}
}
];

/**
 * Create Daily Bad Filtered
 */
SampleApp.DailyBadFiltered.Panel = function() {
	dailyBadFilteredGridPanel = new SampleApp.DailyBadFiltered.GridPanel();
	
   	dbf_page_bar_update_time = new Ext.Toolbar.TextItem({
        text: '',
        id: 'dbf_update_time',
	});
	
    SampleApp.DailyBadFiltered.Panel.superclass.constructor.call(this,{
        frame:true,
        id: 't_dbf_tab_heldoc',
        title: "Daily Bad Filtered",
        closable:true,
        titleCollapse:true,
        layout: 'border',
        items : [
                 dailyBadFilteredGridPanel
        ],
        tools: tools,
        bbar: [dbf_page_bar_update_time]
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

   	//define what structure we expect to see on our AJAX return
   	var store = new Ext.data.JsonStore({
   	    fields: ['case','date','event','victim','attacker','notes']
   	});
   	
   	//makes a call back to the server to get the DBF data
	reload_store = function() {
   		Ext.Ajax.request({
	   	    url: 'controls/queries/daily_bad_filtered.php',
	   	    method:'GET', 
	   	    waitTitle:'Connecting', 
	   	    waitMsg:'Getting data...',
	   	    
	   	    success:function(request){ 
	   	    	var obj = Ext.util.JSON.decode(request.responseText); 
		    	time = new Date();
		    	Ext.getCmp('dbf_update_time').setText("Last updated: " + time); //update the bottom toolbar 
	   	    	store.loadData(obj);
	   	   },
	   	});
   	}
	
	reload_store();

    SampleApp.DailyBadFiltered.GridPanel.superclass.constructor.call(this,{
        region: 'center',
        stateful:true,
        stateId: 'daily_bad_filtered_state',
        store: store,
        cm: cm,
        stripeRows: true,
        autoExpandColumn: 'daily_bad_filter_date',
		autoSizeColumns: true,
		clicksToEdit: 1,
		listeners: {
			cellclick: function(grid, rowIndex, colIndex) { //if the "+" is clicked then pass the data of that record to the createcase
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
			cellcontextmenu: function(grid, rowIndex, colIndex, e) { //enable the pivot searching on the grid
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
Ext.extend(SampleApp.DailyBadFiltered.GridPanel, Ext.grid.EditorGridPanel, {
});