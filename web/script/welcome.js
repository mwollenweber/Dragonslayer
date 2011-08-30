Ext.namespace('SampleApp.Welcome');
Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

function session_check() {
	Ext.Ajax.request({
	    url: 'controls/sessions/checker.php',
	    waitTitle:'Connecting', 
	    waitMsg:'Getting data...',
	    
	    success:function(request){ 
	    	var obj = Ext.util.JSON.decode(request.responseText); 
	    	if(obj != null) {
		    	hidden_user_field.setValue(obj.user);
		    	hidden_role_field.setValue(obj.user_role);
		    	if(obj.dsid != null) {
			    	SampleApp.EditCase.OpenFromGrid(obj.dsid);
		    	}
		    	if(obj.aip != null) {
		    		SampleApp.SearchByIp.PivotSearch("attacker", obj.aip)
		    	}
		    	if(obj.vip != null) {
		    		SampleApp.SearchByIp.PivotSearch("victim", obj.vip)
		    	}
	    	}
	   },
	})
}

session_check();

var hidden_user_field = new Ext.form.TextField({
    name: 'hidden_user',
})

var hidden_role_field = new Ext.form.TextField({
    name: 'hidden_role',
})

var dbf_portlet = new DailyBadFilteredPortlet();
var rvc_portlet = new RecentVipCases();
var dmdl_portlet = new DailyMdlPortlet();
var sp_portlet = new ScratchPadPortlet();
var unenteredCasesPortlet = new UnenteredCasesPortlet(); //portlet is located within create case, but we want it to sync with DBF
var health_status_portlet = new HealthStatusPortlet();

var portlet_tools = [
//             {
//    id:'gear',
//    handler: function(){
//    }
//},
{
    id:'help',
    handler: function(e, target, panel){
    	SampleApp.HelperDocs.Open(panel.id, hidden_user_field.getValue(), hidden_role_field.getValue());
  }
},{
    id:'close',
    handler: function(e, target, panel){
        panel.ownerCt.remove(panel, true);
    }
}];

/**
 * Load the welcome page
 */
Ext.onReady(function() {
    var welcomePanel = new SampleApp.Welcome.Panel();
    var graphPanel = new SampleApp.Welcome.GraphPanel();
    SampleApp.Main.CenterPanelInstance.add(welcomePanel);
    SampleApp.Main.CenterPanelInstance.add(graphPanel);
    SampleApp.Main.CenterPanelInstance.activate(welcomePanel);
    
    SampleApp.Main.EventRelay.fireEvent("log",{
        severity: "info",
        from: "welcome.js",
        message: "Welcome panel loaded",
    });
});

function timeout_trigger(init) {
	if(init != 1) {
		dbf_portlet.reload_store();
		unenteredCasesPortlet.reload_store();
	}
    setTimeout('timeout_trigger()', 10000);
}

function timeout_delay(init) {
	if(init != 1) {
		sp_portlet.reload_store();
		dmdl_portlet.reload_store();
		rvc_portlet.reload_store();
		health_status_portlet.reload_data();
	}
    setTimeout('timeout_delay()', 50000);
}

/**
 * Welcome Panel - contains a welcoming message
 */
SampleApp.Welcome.Panel = function(config) {
    Ext.apply(this,config);
    
    timeout_trigger(1);
    timeout_delay(1);
	
    SampleApp.Welcome.Panel.superclass.constructor.call(this,{
        frame:true,
        layout: "fit",
        title:'Portal',
        closable: false,
        items: [{
			xtype:'portal',
			margins: '0 0 10 10',
			cmargins: '10 10 10 10' ,
			region:'center',
			items: [ {  
				columnWidth:.49,
				style:'padding:10px 10 10px 10px',
				items: [ {
						id: 'p_dbf_portlet_heldoc',
						frame:true,         
						title: 'Daily Bad Filtered',
						tools: portlet_tools,
						items: dbf_portlet,
				        stateful:true,
				        stateId: 'testing_state',
					}, {
						id: 'p_recent_vip_cases_portlet_heldoc',
						title: 'Recent VIP Cases',
						tools: portlet_tools,
						items: rvc_portlet,
					}, {
						id: 'p_weekly_report_portlet_heldoc',
						title: 'Weekly Report',
						tools: portlet_tools,
						items: new WeeklyReportPortlet(),
					}
				]},
				{
					columnWidth:.49,
					style: 'padding:10px 5px 10px 10px',
				
					items: [{
						id: 'p_public_scratch_portlet_heldoc',
						title: 'Public Scratch Pad',
						tools: portlet_tools,
						items: sp_portlet,
					}, {
						id: 'p_search_portlet_heldoc',
						title: 'Quick Search',
						tools: portlet_tools,
						items: new SearchByTypePortlet(),
					}, {
						id: 'p_dmdl_portlet_heldoc',
						frame:true,         
						title: 'Daily MDL',
						tools: portlet_tools,
						items: dmdl_portlet
					}, 
					{
						id: 'p_health_status_portlet_heldoc',
						frame:true,         
						title: 'Health Status',
						tools: portlet_tools,
						items: health_status_portlet
					}, 
				]}
			]
    	}]
    });
};

/**
 * Welcome Panel
 */
Ext.extend(SampleApp.Welcome.Panel, Ext.Panel, {
});

/**
 * Welcome Panel - contains a welcoming message
 */
SampleApp.Welcome.GraphPanel = function(config) {
    Ext.apply(this,config);
    
    timeout_trigger(1);
    timeout_delay(1);
	
    SampleApp.Welcome.GraphPanel.superclass.constructor.call(this,{
        frame:true,
        layout: "fit",
        title:'Graph Reporting',
        closable: false,
        items: [{
			xtype:'portal',
			margins: '0 0 10 10',
			cmargins: '10 10 10 10' ,
			region:'center',
			items: [ {  
				columnWidth:.49,
				style:'padding:10px 10 10px 10px',
				items: [ {
						id: 'p_top_10_events_portlet_heldoc',
						title: 'Top 10 Compromise Events (30 days)',
						items: new Top10Events30DaysGraphPortlet(),
						tools: portlet_tools,
						height: 400
					}, {
						id: 'p_weekly_contribution_portlet_heldoc',
						title: 'Weekly Contribution',
						items: new WeeklyContributionGraphPortlet(),
						tools: portlet_tools,
						height: 400
					}, {
						id: 'p_top_report_categories_portlet_heldoc',
						title: 'Top Report Categories (30 days)',
						items: new TopReportCategories30DaysGraphPortlet(),
						tools: portlet_tools,
						height: 400
					}
				]},
				{
					columnWidth:.49,
					style: 'padding:10px 5px 10px 10px',
				
					items: [{
						id: 'p_weekly_report_graph_portlet_heldoc',
						title: 'Weekly Report',
						tools: portlet_tools,
						items: new WeeklyReportGraphPortlet(),
						height: 500
					}, {
						id: 'p_top_10_networks_portlet_heldoc',
						title: 'Top 10 Compromised Networks (30 days)',
						items: new Top10Networks30DaysGraphPortlet(),
						tools: portlet_tools,
						height: 400
					}, {
						id: 'p_historical_portlet_heldoc',
						frame:true,         
						title: 'Historical Forecasting',
						tools: portlet_tools,
						items: new HistoricalStatisticsChartPortlet(),
					}
				]}
			]
    	}]
    });
};

/**
 * Welcome Panel
 */
Ext.extend(SampleApp.Welcome.GraphPanel, Ext.Panel, {
});