function NeedsResearchCases(){
	
	var cm = new Ext.grid.ColumnModel([ 
		{ id :'needs_research_cases_dsid', header : 'DSID', width : 160, sortable : true, dataIndex: 'dsid' },
		{ header : 'Date', width : 160, sortable : true, dataIndex: 'date' },
		{ header : 'Analyst', width : 160, sortable : true, dataIndex: 'analyst' },
		{ header : 'Event', width : 200, sortable : true, dataIndex: 'event' },
		{ header : 'Victim', width : 120, sortable : true, dataIndex: 'victim', editor: new Ext.form.TextField({ allowBlank: false }) },
		{ header : 'Attacker', width : 120, sortable : true, dataIndex: 'attacker', editor: new Ext.form.TextField({ allowBlank: false }) },
		{ header : 'Network', width : 170, sortable : true, dataIndex: 'network'},
		{ header : 'Notes', width : 170, sortable : true, dataIndex: 'notes'}
	]);
	cm.defaultSortable = true; 

	var needs_research_store = new Ext.data.ArrayStore({
        fields: [
           {name: 'dsid'},	
           {name: 'date'},
           {name: 'analyst'},
           {name: 'event'},
           {name: 'victim'},
           {name: 'attacker'},
           {name: 'network'},
           {name: 'notes'},
        ]
    });
	
	this.reload_store = function() {
		Ext.Ajax.request({
		    url: 'controls/queries/needs_research_cases.php',
		    method:'GET', 
		    waitTitle:'Connecting', 
		    waitMsg:'Getting data...',
		    
		    success:function(request){ 
		    	var obj = Ext.util.JSON.decode(request.responseText); 
		    	time = new Date();
		    	Ext.getCmp('needs_research_cases_bottom_bar').setText("Last updated: " + time);  
		    	needs_research_store.loadData(obj);
		   },
		});
	}
	
	this.reload_store();
	
	needs_research_cases_bottom_bar = new Ext.Toolbar.TextItem({
        text: '',
        id: 'needs_research_cases_bottom_bar',
	})
	
	NeedsResearchCases.superclass.constructor.call(this, {
        store: needs_research_store,
        cm: cm,
        stateful:true,
        stateId: 'needs_research_cases_portlet_state',
        bbar:[needs_research_cases_bottom_bar],
        stripeRows: true,
        autoExpandColumn: 'needs_research_cases_dsid',
        height: 300,
        viewConfig: {forceFit: true},
		autoSizeColumns: true,
		clicksToEdit: 1,
		listeners: {
			cellclick: function(grid, rowIndex, colIndex) {
				if (colIndex == 0) {
					var rec = grid.getStore().getAt(rowIndex);
					dsid = rec.get('dsid');
					SampleApp.EditCase.OpenFromGrid(dsid);
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

Ext.extend(NeedsResearchCases, Ext.grid.EditorGridPanel);