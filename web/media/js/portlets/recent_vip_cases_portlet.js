function RecentVipCases(){

	var cm = new Ext.grid.ColumnModel([ 
		{ id :'recent_vip_case_dsid', header : 'DSID', width : 75, sortable : true, dataIndex: 'dsid' },
		{ header : 'Date', width : 160, sortable : true, dataIndex: 'date', renderer: renderTip },
		{ header : 'Analyst', width : 120, sortable : true, dataIndex: 'analyst', renderer: renderTip },
		{ header : 'Event', width : 200, sortable : true, dataIndex: 'event', renderer: renderTip },
		{ header : 'Victim', width : 120, sortable : true, dataIndex: 'victim', editor: new Ext.form.TextField({ allowBlank: false }), renderer: renderTip },
		{ header : 'Attacker', width : 120, sortable : true, dataIndex: 'attacker', editor: new Ext.form.TextField({ allowBlank: false }), renderer: renderTip },
		{ header : 'Network', width : 170, sortable : true, dataIndex: 'network', renderer: renderTip},
		{ header : 'Notes', width : 170, sortable : true, dataIndex: 'notes', renderer: renderTip}
	]);
	cm.defaultSortable = true; 
	
	var recent_vip_store = new Ext.data.JsonStore({
	    fields: ['dsid','date','analyst','event','victim','attacker','network','notes']
	});
	
	this.reload_store = function() {
		Ext.Ajax.request({
		    url: '/recent_vip_cases/',
		    method:'GET', 
		    waitTitle:'Connecting', 
		    waitMsg:'Getting data...',
		    
		    success:function(request){ 
		    	var obj = Ext.util.JSON.decode(request.responseText); 
		    	time = new Date();
		    	Ext.getCmp('recent_vip_bottom_bar').setText("Last updated: " + time);  
		    	recent_vip_store.loadData(obj.data);
		   },
		});
	}
	
	this.reload_store();
	
	recent_vip_bottom_bar = new Ext.Toolbar.TextItem({
        text: '',
        id: 'recent_vip_bottom_bar',
	})
	
    function renderTip(val, meta, rec, rowIdx, colIdx, ds) {
    	return '<div ext:qtitle="' + "Data" + '" ext:qtip="' + val + '">' + val + '</div>';
    }
	
	RecentVipCases.superclass.constructor.call(this, {
        store: recent_vip_store,
        cm: cm,
        bbar:[recent_vip_bottom_bar],
        stripeRows: true,
        autoExpandColumn: 'recent_vip_case_dsid',
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

Ext.extend(RecentVipCases, Ext.grid.EditorGridPanel);