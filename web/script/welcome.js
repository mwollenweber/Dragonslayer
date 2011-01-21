Ext.namespace('SampleApp.Welcome');

var dbf_portlet = new DailyBadFilteredPortlet();
var rvc_portlet = new RecentVipCases();

var tools = [{
    id:'gear',
    handler: function(){
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

function timeout_trigger() {
	dbf_portlet.reload_store();
	rvc_portlet.reload_store();
    setTimeout('timeout_trigger()', 10000);
}

/**
 * Welcome Panel - contains a welcoming message
 */
SampleApp.Welcome.Panel = function(config) {
    Ext.apply(this,config);
    timeout_trigger();

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
						frame:true,         
						title: 'Daily Bad Filtered',
						tools: tools,
						items: dbf_portlet
					}, {
						title: 'Recent VIP Cases',
						tools: tools,
						items: rvc_portlet,
						height: 300,
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
						title: 'Weekly Report',
						tools: tools,
						items: new WeeklyReportPortlet(),
					}, {
						title: 'Weekly Contribution',
						items: new WeeklyContributionGraphPortlet(),
						tools: tools,
						height: 400
					}, {
//						title: 'Recent VIP Cases',
//						tools: tools,
//						items: rvc_portlet,
//						height: 300,
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

