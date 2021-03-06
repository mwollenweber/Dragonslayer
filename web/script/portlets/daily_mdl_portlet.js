function DailyMdlPortlet(){

	var cm = new Ext.grid.ColumnModel([ 
        { header : 'Create case', width : 100, sortable : true, dataIndex: 'case' },
		{ id :'daily_mdl_date', header : 'Date', width : 160, sortable : true, dataIndex: 'date' },
		{ header : 'Event', width : 200, sortable : true, dataIndex: 'event' },
		{ header : 'Victim', width : 120, sortable : true, dataIndex: 'victim', editor: new Ext.form.TextField({ allowBlank: false }) },
		{ header : 'Attacker', width : 120, sortable : true, dataIndex: 'attacker', editor: new Ext.form.TextField({ allowBlank: false }) },
		{ header : 'Notes', width : 170, sortable : true, dataIndex: 'notes'}
	]);
	cm.defaultSortable = true; 

	//define the fields we expect to see in the store
	var store = new Ext.data.JsonStore({
	    fields: ['case','date','event','victim','attacker','notes']
	});
	
	//method to reload the store
	this.reload_store = function() {
		Ext.Ajax.request({
		    url: 'controls/queries/daily_mdl.php',
		    method:'GET', 
		    waitTitle:'Connecting', 
		    waitMsg:'Getting data...',
		    
		    success:function(request){ 
		    	var obj = Ext.util.JSON.decode(request.responseText); 
		    	time = new Date();
//		    	hours = time.getHours();
//		    	minutes = time.getMinutes();
//		    	seconds = time.getSeconds();
//		    	last_updated = hours + ":" + minutes + ":" + seconds;
		    	Ext.getCmp('dmdl_bottom_bar').setText("Last updated: " + time);  
		    	store.loadData(obj);
		   },
		});
	}
	
	this.reload_store();
	
    dmdl_tbar = new Ext.Toolbar.TextItem({
        text: '',
        id: 'dmdl_bottom_bar',
	})
	
    //define the portlet
	DailyMdlPortlet.superclass.constructor.call(this, {
        store: store,
        stateful:true,
        stateId: 'daily_mdl_portlet_state',
        cm: cm,
        bbar:[dmdl_tbar],
        stripeRows: true,
        autoExpandColumn: 'daily_mdl_date',
        height: 300,
        viewConfig: {forceFit: true},
		autoSizeColumns: true,
		loadMask: true,
		clicksToEdit: 1,
		listeners: {
			cellclick: function(grid, rowIndex, colIndex) { //create a case from the click
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
			cellcontextmenu: function(grid, rowIndex, colIndex, e) { //enable pivot searching
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

Ext.extend(DailyMdlPortlet, Ext.grid.EditorGridPanel);