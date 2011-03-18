Ext.namespace('SampleApp.Welcome');

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

var tools = [{
    id:'gear',
    handler: function(){
    }
},{
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
    SampleApp.Main.CenterPanelInstance.add(welcomePanel);
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
						tools: tools,
						items: dbf_portlet
					}, {
						title: 'Recent VIP Cases',
						tools: tools,
						items: rvc_portlet,
					}, {
						title: 'Weekly Report',
						tools: tools,
						items: new WeeklyReportGraphPortlet(),
						height: 500
					}
				]},
				{
					columnWidth:.49,
					style: 'padding:10px 5px 10px 10px',
				
					items: [{
						title: 'Public Scratch Pad',
						tools: tools,
						items: sp_portlet,
					}, {
						title: 'Quick Search',
						tools: tools,
						items: new SearchByTypePortlet(),
					}, {
						frame:true,         
						title: 'Daily MDL',
						tools: tools,
						items: dmdl_portlet
					}, {
						title: 'Weekly Contribution',
						items: new WeeklyContributionGraphPortlet(),
						tools: tools,
						height: 400
					}, {
						title: 'Weekly Report',
						tools: tools,
						items: new WeeklyReportPortlet(),
					}
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

