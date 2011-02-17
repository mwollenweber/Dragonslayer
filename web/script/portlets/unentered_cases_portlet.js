function UnenteredCasesPortlet(){

	var cm = new Ext.grid.ColumnModel([ 
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
	
	this.reload_store = function() {
		Ext.Ajax.request({
		    url: 'controls/queries/daily_bad_filtered.php',
		    method:'GET', 
		    waitTitle:'Connecting', 
		    waitMsg:'Getting data...',
		    
		    success:function(request){ 
		    	var obj = Ext.util.JSON.decode(request.responseText); 
		    	store.loadData(obj);
		   },
		});
	}
	
	function get_ip_info(victim) {
		Ext.Ajax.request({
		    url: '../code/psp/get_ip_info.psp',
		    waitTitle:'Connecting', 
		    waitMsg:'Getting data...',
		    params: { 'ip': victim, type: 'json'},
		    
		    success:function(request){ 
		    	var obj = Ext.util.JSON.decode(request.responseText); 
		    	network_field.setValue(obj.ip_msg.network_name);
		    	dns_field.setValue(obj.ip_msg.fqdn);
		    	dhcp_field.setValue(obj.ip_msg.dhcp_info);
		    	if (obj.ip_msg.critical_info != "FALSE") {
		    		Ext.Msg.alert('Critical', 'This is a VIP machine!');
		    	}	    	
		    	if (obj.ip_msg.recent_case != "0") {
		    		Ext.Msg.alert('Critical', 'A case exists for this IP!');
		    	}
		    	if (obj.ip_msg.ip_alert != "FALSE") {
		    		Ext.Msg.alert('Critical', obj.ip_msg.ip_alert.msg);
		    	}
		   },
		});
	}
	
	function snatch_user() {
		Ext.Ajax.request({
		    url: 'controls/authentication/snatch_user.php',
		    waitTitle:'Connecting', 
		    waitMsg:'Getting data...',
		    
		    success:function(request){ 
		    	var obj = Ext.util.JSON.decode(request.responseText); 
		    	reporter_field.setValue(obj.user);
		   },
		})
	}
	
	UnenteredCasesPortlet.superclass.constructor.call(this, {
        store: store,
        cm: cm,
        stripeRows: true,
        autoExpandColumn: 'daily_bad_filter_date',
        height: 300,
        viewConfig: {forceFit: true},
		autoSizeColumns: true,
		clicksToEdit: 1,
		listeners: {
			cellclick: function(grid, rowIndex, colIndex) {
				var rec = grid.getStore().getAt(rowIndex);
				date_field.setValue(rec.get('date'));
				event_field.setValue(rec.get('event'));
				victim_field.setValue(rec.get('victim'));
				attacker_field.setValue(rec.get('attacker'));
				notes_field.setValue(rec.get('notes'));
				get_ip_info(rec.get('victim'));
				snatch_user();
			}
		}
    });
}

Ext.extend(UnenteredCasesPortlet, Ext.grid.EditorGridPanel);