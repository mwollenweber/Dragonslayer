Ext.namespace("SampleApp.WeeklyCases");
var weeklyCasesGridPanel;
var reload_store;

/**
 * Attach the launcher panel to the West Panel
 */
Ext.onReady(function(){
    SampleApp.Main.EventRelay.on("openWeeklyCases",SampleApp.WeeklyCases.Open);
});

/**
 * Event handler
 */
SampleApp.WeeklyCases.Open = function() {
    var weeklyCasesPanel = new SampleApp.WeeklyCases.Panel();
    SampleApp.Main.CenterPanelInstance.add(weeklyCasesPanel);
    SampleApp.Main.CenterPanelInstance.activate(weeklyCasesPanel);
    
    SampleApp.Main.EventRelay.fireEvent("log",{
        severity: "info",
        from: "weekly_cases.js",
        message: "Weekly Cases Opened",
    });
}

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
SampleApp.WeeklyCases.Panel = function() {
	weeklyCasesGridPanel = new SampleApp.WeeklyCases.GridPanel();
	
	weekly_cases_page_bar_update_time = new Ext.Toolbar.TextItem({
        text: '',
        id: 'weekly_cases_page_bar',
	});
	
    SampleApp.WeeklyCases.Panel.superclass.constructor.call(this,{
        frame:true,
        title: "Weekly Cases",
        closable:true,
        titleCollapse:true,
        layout: 'border',
        items : [
                 weeklyCasesGridPanel
        ],
        tools: tools,
        bbar: [weekly_cases_page_bar_update_time]
    });
};

/**
 *   Weekly Cases
 */
Ext.extend(SampleApp.WeeklyCases.Panel, Ext.Panel, {
});

/**
 * Grid Panel
 */
SampleApp.WeeklyCases.GridPanel = function() {
	
	// create the data store
    store = new Ext.data.ArrayStore({
        fields: [
           {name: 'dsid'},	
           {name: 'date'},
           {name: 'analyst'},
           {name: 'event'},
           {name: 'victim'},
           {name: 'attacker'},
           {name: 'dns'},
           {name: 'network'},
           {name: 'user_verification'},
           {name: 'confirmation'},
           {name: 'report_category'}
        ]
    });
	
	reload_store = function() {
   		Ext.Ajax.request({
	   	    url: 'controls/queries/weekly_cases.php',
	   	    method:'GET', 
	   	    waitTitle:'Connecting', 
	   	    waitMsg:'Getting data...',
	   	    
	   	    success:function(request){ 
	   	    	var obj = Ext.util.JSON.decode(request.responseText); 
		    	time = new Date();
		    	Ext.getCmp('weekly_cases_page_bar').setText("Last updated: " + time);  
	   	    	store.loadData(obj);
	   	   },
	   	});
	}
    
	reload_store();
   	
    function renderTip(val, meta, rec, rowIdx, colIdx, ds) {
    	return '<div ext:qtitle="' + "Data" + '" ext:qtip="' + val + '">' + val + '</div>';
    }
    
    SampleApp.WeeklyCases.GridPanel.superclass.constructor.call(this,{
        store: store,
        columns: [
	          {
	              header   : 'DSID', 
	              sortable : true, 
	              dataIndex: 'dsid'
	          },
            {
                header   : 'Date', 
                sortable : true, 
                width    : 120, 
                dataIndex: 'date'
            },
            {
                header   : 'Analyst', 
                sortable : true, 
                dataIndex: 'analyst'
            },
            {
                header   : 'Event', 
                width    : 120, 
                sortable : true, 
                dataIndex: 'event'
            },
            {
                header   : 'Victim', 
                width    : 120, 
                sortable : true, 
                dataIndex: 'victim'
            },
            {
                header   : 'Attacker', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'attacker'
            },
            {
                header   : 'DNS', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'dns'
            },
            {
                header   : 'Network', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'network'
            },
            {
                header   : 'Verification', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'user_verification',
                renderer: renderTip
            },
            {
            	id		 : 'search_by_ip_confirmation',
                header   : 'Confirmation', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'confirmation',
                renderer: renderTip
            },
            {
                header   : 'Category', 
                width    : 170, 
                sortable : true, 
                dataIndex: 'report_category'
            }
        ],
        stripeRows: true,
        autoExpandColumn: 'search_by_ip_confirmation',
        region: 'center',
		autoSizeColumns: true,
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

/**
 *  Grid Panel
 */
Ext.extend(SampleApp.WeeklyCases.GridPanel, Ext.grid.GridPanel, {
});
