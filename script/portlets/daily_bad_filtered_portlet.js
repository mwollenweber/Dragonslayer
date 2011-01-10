DailyBadFilteredPortlet = function() {

    var columns = [
		{ id :'daily_bad_filter_date', header : 'Date', width : 160, sortable : true, dataIndex: 'date' },
		{ header : 'Event', width : 200, sortable : true, dataIndex: 'event' },
		{ header : 'Victim', width : 120, sortable : true, dataIndex: 'victim' },
		{ header : 'Attacker', width : 120, sortable : true, dataIndex: 'attacker' },
		{ header : 'Notes', width : 170, sortable : true, dataIndex: 'notes'}
	];

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

	DailyBadFilteredPortlet.superclass.constructor.call(this, {
        store: store,
        columns: columns,
        stripeRows: true,
        autoExpandColumn: 'daily_bad_filter_date',
        height: 300,
        viewConfig: {forceFit: true}
    });
}

Ext.extend(DailyBadFilteredPortlet, Ext.grid.GridPanel);