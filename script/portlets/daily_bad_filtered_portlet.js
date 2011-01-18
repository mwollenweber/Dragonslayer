DailyBadFilteredPortlet = function() {

	var cm = new Ext.grid.ColumnModel([ 
        { header : 'Create case', width : 100, sortable : true, dataIndex: 'case'},
		{ id :'daily_bad_filter_date', header : 'Date', width : 160, sortable : true, dataIndex: 'date' },
		{ header : 'Event', width : 200, sortable : true, dataIndex: 'event' },
		{ header : 'Victim', width : 120, sortable : true, dataIndex: 'victim' },
		{ header : 'Attacker', width : 120, sortable : true, dataIndex: 'attacker' },
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
	
	DailyBadFilteredPortlet.superclass.constructor.call(this, {
        store: store,
        cm: cm,
        stripeRows: true,
        autoExpandColumn: 'daily_bad_filter_date',
        height: 300,
        viewConfig: {forceFit: true},
		autoSizeColumns: true,
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

Ext.extend(DailyBadFilteredPortlet, Ext.grid.GridPanel);