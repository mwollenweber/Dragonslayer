WeeklyReportPortlet = function() {
	
	var cm = new Ext.grid.ColumnModel([ 
   		{ id :'weekly_report_device', header : 'Device Name', width : 160, sortable : true, dataIndex: 'device' },
   		{ header : 'IP', width : 200, sortable : true, dataIndex: 'ip' },
   		{ header : 'School/Department', width : 120, sortable : true, dataIndex: 'department'},
   		{ header : 'Date/Time', width : 120, sortable : true, dataIndex: 'date'},
   		{ header : 'Patchlink', width : 170, sortable : true, dataIndex: 'patchlink'},
   		{ header : 'Last Patchlink Check-in', width : 170, sortable : true, dataIndex: 'last_patchlink_check'},
   		{ header : 'Notes', width : 170, sortable : true, dataIndex: 'notes'}
   	]);
	cm.defaultSortable = true; 
    
	var store = new Ext.data.JsonStore({
	    fields: ['device','ip','department','date','patchlink','last_patchlink_check','notes']
	});
	
    var myData = Ext.Ajax.request({
        url: '/weekly_report/',
        method:'GET', 
        waitTitle:'Connecting', 
        waitMsg:'Getting data...',
        
        success:function(request){ 
        	var obj = Ext.util.JSON.decode(request.responseText); 
        	store.loadData(obj.data);
       },
	});

    WeeklyReportPortlet.superclass.constructor.call(this, {
        region: 'center',
        store: store,
        cm: cm,
        stripeRows: true,
        height: 300,
        autoExpandColumn: 'weekly_report_device',
        viewConfig: {forceFit: true}
    });
}

Ext.extend(WeeklyReportPortlet, Ext.grid.GridPanel);