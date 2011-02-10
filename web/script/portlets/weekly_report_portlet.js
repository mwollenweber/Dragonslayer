WeeklyReportPortlet = function() {

    var store = new Ext.data.ArrayStore({
        fields: [
           {name: 'device'},
           {name: 'ip'},
           {name: 'department'},
           {name: 'date'},
           {name: 'patchlink'},
           {name: 'last_patchlink_check'},
           {name: 'notes'}
        ]
    });
	
    var myData = Ext.Ajax.request({
        url: 'controls/reports/weekly_report.php',
        method:'GET', 
        waitTitle:'Connecting', 
        waitMsg:'Getting data...',
        
        success:function(request){ 
        	var obj = Ext.util.JSON.decode(request.responseText); 
        	store.loadData(obj);
       },
	});

    WeeklyReportPortlet.superclass.constructor.call(this, {
        region: 'center',
        store: store,
        tbar : [
    	        {
    	          xtype: 'exportbutton',
    	          store: store
    	        }
         	],
        columns: [
            {
                id       :'weekly_report_device',
                header   : 'Device Name', 
                width    : 160, 
                sortable : true, 
                dataIndex: 'device'
            },
            {
                header   : 'IP', 
                width    : 200, 
                sortable : true, 
                dataIndex: 'ip'
            },
            {
                header   : 'School/Department', 
                width    : 120, 
                sortable : true, 
                dataIndex: 'department'
            },
            {
                header   : 'Date/Time', 
                width    : 120, 
                sortable : true, 
                dataIndex: 'date'
            },
            {
                header   : 'Patchlink', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'patchlink'
            },
            {
                header   : 'Last Patchlink Checkin', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'last_patchlink_check'
            },
            {
                header   : 'Notes', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'notes'
            }
        ],
        stripeRows: true,
        height: 300,
        autoExpandColumn: 'weekly_report_device',
        viewConfig: {forceFit: true}
    });
}

Ext.extend(WeeklyReportPortlet, Ext.grid.GridPanel);