Ext.namespace("SampleApp.SearchByIp");
var searchByIpFormPanel;
var searchByIpGridPanel;
var store;
var search_result_count = 0;
var search_results_tbar;
var form_data;
var search_value;
var search_type;

/**
 * When clicked, fire the open action
 */
Ext.onReady(function(){
	Ext.QuickTips.init();
    SampleApp.Main.EventRelay.on("openSearchByType",SampleApp.SearchByIp.Open);

});

/**
 * @description processes the search setup by the user and redraws with results
 * @param type
 * @param value
 * @returns
 */
function process_search(type,value) {
	Ext.Ajax.request({
		url: 'controls/actions/search_by_type.php',
        method:'POST', 
        waitTitle:'Connecting', 
        waitMsg:'Getting data...',
        params: { 'search_type': type, 'search_value': value },
        
        success:function(request){ 
        	var obj = Ext.util.JSON.decode(request.responseText);
        	if(obj.results == null) {
        		Ext.Msg.alert('Results', 'No search results found!');
        		search_result_count = "0";
            	Ext.getCmp('search_results_bar').setText("Search results: " + search_result_count);  
        	}
        	search_result_count = obj.total;
        	Ext.getCmp('search_results_bar').setText("Search results: " + search_result_count);  
        	store.loadData(obj);
        	store.setBaseParam("search_type", type);
        	store.setBaseParam("search_value", value);
       },
	});
}

/**
 * Event handler
 */
SampleApp.SearchByIp.Open = function() {
    var searchByIpPanel = new SampleApp.SearchByIp.Panel();
    SampleApp.Main.CenterPanelInstance.add(searchByIpPanel);
    SampleApp.Main.CenterPanelInstance.activate(searchByIpPanel);
    
    SampleApp.Main.EventRelay.fireEvent("log",{
        severity: "info",
        from: "search_by_type.js",
        message: "Search by Type opened",
    });
}

//registers with helper docs
var action_tools = [{
	id:'help',
	handler: function(e, target, panel){
		SampleApp.HelperDocs.Open(panel.id, hidden_user_field.getValue(), hidden_role_field.getValue());
	}
}];

//assumes we came in from a grid
SampleApp.SearchByIp.PivotSearch = function(type, value) {
    var searchByIpPanel = new SampleApp.SearchByIp.Panel();
    SampleApp.Main.CenterPanelInstance.add(searchByIpPanel);
    SampleApp.Main.CenterPanelInstance.activate(searchByIpPanel);
    
    if(type == "attacker" || type == "victim") {
    	type = type + "_ip"; //prep for searching
    }

	process_search(type, value);
}

/**
 * Search form panel
 */
SampleApp.SearchByIp.Panel = function() {
	
    searchByIpFormPanel = new SampleApp.SearchByIp.FormPanel();
    searchByIpGridPanel = new SampleApp.SearchByIp.GridPanel();
    SampleApp.SearchByIp.Panel.superclass.constructor.call(this,{
        frame:true,
        title: "Search by Type",
        id: 't_search_tab_heldoc',
        tools: action_tools,
        closable:true,
        titleCollapse:true,
        layout: 'border',
        items : [
                 searchByIpFormPanel,	
                 searchByIpGridPanel
        ]
    });
};

/**
 * 
 */
Ext.extend(SampleApp.SearchByIp.Panel, Ext.Panel, {
});

/**
 *
 */
SampleApp.SearchByIp.FormPanel = function(){
	
	SampleApp.SearchByIp.categories = [
      ['dsid', 'DSID'],
      ['analyst', 'Analyst'],
      ['netid', 'NetID'],
      ['dragon_event', 'Event'],
      ['victim_ip', 'Victim IP'],
      ['attacker_ip', 'Attacker IP'],
      ['network', 'Network'],
      ['text_in_verification', 'Text in Verification'],
     ];
	
	search_value = new Ext.form.TextField({
        fieldLabel: 'Value',
        name: 'search_value',
        allowBlank:false,
        width: 400
    });
	
	search_type = new Ext.form.ComboBox({
        fieldLabel: 'Type',
        name: 'type',
        hiddenName: 'search_type',
        width: 400,
        store: new Ext.data.ArrayStore({
            fields: ['code', 'search_type'],
            data : SampleApp.SearchByIp.categories
        }),
        valueField:'code',
        displayField:'search_type',
        typeAhead: true,
        allowBlank:false,
        mode: 'local',
        triggerAction: 'all',
        emptyText:'Select a type...',
    });
	
    SampleApp.SearchByIp.FormPanel.superclass.constructor.call(this,{
        frame:false,
        buttonAlign : 'left',
        bodyStyle:'padding:5px 5px 0',
        width: 500,
        defaultType: 'textfield',
        items: [
            search_type,
            search_value
        ],

        buttons: [{
            text: 'Search',   
            formBind: true,	 
            handler:function(){ 
            	value = search_value.getValue();
            	type = search_type.getValue();
            	process_search(type, value);
            },
        }],
        keys: [
               { key: [Ext.EventObject.ENTER], handler: function() { //register the enter key for the search button
	               	value = search_value.getValue();
	            	type = search_type.getValue();
	            	process_search(type, value);
                   }
               }
           ],
        region: "north",
        height: 100
    });
}

/**
 *
 */
Ext.extend(SampleApp.SearchByIp.FormPanel, Ext.FormPanel, {
});

/**
 * Grid Panel for results
 */
SampleApp.SearchByIp.GridPanel = function() {

	store = new Ext.data.JsonStore({
	    fields: ['dsid','date','analyst','event','victim','attacker','dns','network','confirmation','category'],
	    remoteSort:true,
	    totalProperty:'total',
	    root:'results',
	    url: 'controls/actions/search_by_type.php',
	});
    
	var cm = new Ext.grid.ColumnModel([ 
	    { header : 'DSID', width : 100, sortable : true, dataIndex: 'dsid' },
		{ header : 'Date', width : 160, sortable : true, dataIndex: 'date' },
		{ header : 'Analyst', width : 100, sortable : true, dataIndex: 'analyst' },
		{ header : 'Event', width : 150, sortable : true, dataIndex: 'event'},
		{ header : 'Victim', width : 120, sortable : true, dataIndex: 'victim' },
		{ header : 'Attacker', width : 120, sortable : true, dataIndex: 'attacker'},
		{ header : 'DNS', width : 100, sortable : true, dataIndex: 'dns'},
		{ header : 'Network', width : 170, sortable : true, dataIndex: 'network'},
		{ header : 'Confirmation', width : 200, sortable : true, dataIndex: 'confirmation', id: 'search_by_ip_confirmation',renderer: renderConfirmation},
		{ header : 'Category', width : 170, sortable : true, dataIndex: 'category'},
	]);
	cm.defaultSortable = true; 
    
    function renderConfirmation(val, meta, rec, rowIdx, colIdx, ds) { //shows us a little bubble over the data so we don't need to click to see it
    	return '<div ext:qtitle="' + "Confirmation" + '" ext:qtip="' + val + '">' + val + '</div>';
    }
    
    search_results_tbar = new Ext.Toolbar.TextItem({
        text: 'Search results: 0',
        id: 'search_results_bar',
	})
    
    SampleApp.SearchByIp.GridPanel.superclass.constructor.call(this,{
        region: 'center',
        stateful:true,
        stateId: 'search_by_type_state',
        store: store,
        cm: cm,
        trackMouseOver: true,
        stripeRows: true,
        autoExpandColumn: 'search_by_ip_confirmation',
		listeners: {
			cellclick: function(grid, rowIndex, colIndex) { //if user clicks on the DSID then we want to jump to edit case
				if (colIndex == 0) {
					var rec = grid.getStore().getAt(rowIndex);
					dsid = rec.get('dsid');
					SampleApp.EditCase.OpenFromGrid(dsid);
				}
			}
		},
		bbar: new Ext.PagingToolbar({ //paging toolbar showing the number of results with other controls
			store:store,
		    pageSize: 50,
			displayInfo:true,
			displayMessage:"Displaying results {0} - {1} of {2}"
		})
    });
}

/**
 *  Grid Panel
 */
Ext.extend(SampleApp.SearchByIp.GridPanel, Ext.grid.GridPanel, {
});