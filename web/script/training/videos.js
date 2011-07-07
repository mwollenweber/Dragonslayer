Ext.namespace("SampleApp.Videos");

/**
 * Attach the launcher panel to the West Panel
 */
Ext.onReady(function(){
    SampleApp.Main.EventRelay.on("openVideoTraining",SampleApp.Videos.Open);
});

/**
 * Event handler
 */
SampleApp.Videos.Open = function() {
    var VideosPanel = new SampleApp.Videos.Panel();
    SampleApp.Main.CenterPanelInstance.add(VideosPanel);
    SampleApp.Main.CenterPanelInstance.activate(VideosPanel);
    
    SampleApp.Main.EventRelay.fireEvent("log",{
        severity: "info",
        from: "dragon_interface.js",
        message: "DS Videos",
    });
}

/**
 * 
 */
SampleApp.Videos.Panel = function() {
	
	authContent = "This video will demonstrate how to login and register to DragonSlayer.";
	
	authPanel = new Ext.Panel({
        frame:true,
        title: "Authentication and Registration",
        closable:true,
        titleCollapse:true,
        html: authContent,
        buttons: [{
        	text: 'View',
            handler: function() {
                var win = new Ext.Window({
                    layout      : 'fit',
                    autoWidth   : true,
                    autoHeight	: true,
                    closeAction :'hide',
                    plain       : true,
                    stateful    : false,
                    modal		: true,
                    buttons: [{
                        text     : 'Close',
                        handler  : function(){
                            win.close();
                        }
                    }],
                	html: '<embed src="https://128.164.80.81/ds2/web/media/DS2_Auth.mov" width="1200" height="700"></embed>',
                })
                win.show(); 
        	}
        }]
	})
	
	portletContent = "This video will demonstrate navigating through the portlets on the main screen and explaining how they operate.";
	
	portletPanel = new Ext.Panel({
        frame:true,
        title: "Portlets",
        closable:true,
        titleCollapse:true,
        html: portletContent,
        buttons: [{
        	text: 'View',
            handler: function() {
                var win = new Ext.Window({
                    layout      : 'fit',
                    autoWidth   : true,
                    autoHeight	: true,
                    closeAction :'hide',
                    plain       : true,
                    stateful    : false,
                    modal		: true,
                    buttons: [{
                        text     : 'Close',
                        handler  : function(){
                            win.hide();
                        }
                    }],
                	html: '<embed src="https://128.164.80.81/ds2/web/media/DS2_Portlets.mov" width="1200" height="700"></embed>',
                })
                win.show(); 
        	}
        }]
	})
	
	queriesContent = "This video will demonstrate using the queries menu while explaining what each query does and how it works within Dragonslayer.";
	
	queriesPanel = new Ext.Panel({
        frame:true,
        title: "Queries",
        closable:true,
        titleCollapse:true,
        html: queriesContent,
        buttons: [{
        	text: 'View',
            handler: function() {
                var win = new Ext.Window({
                    layout      : 'fit',
                    autoWidth   : true,
                    autoHeight	: true,
                    closeAction :'hide',
                    plain       : true,
                    stateful    : false,
                    modal		: true,
                    buttons: [{
                        text     : 'Close',
                        handler  : function(){
                            win.hide();
                        }
                    }],
                	html: '<embed src="https://128.164.80.81/ds2/web/media/DS2_Queries.mov" width="1200" height="700"></embed>',
                })
                win.show(); 
        	}
        }]
	})
	
	actionsContent = "This video will demonstrate using the actions menu including creating a case, editing a case and searching within Dragonslayer.";
	
	actionsPanel = new Ext.Panel({
        frame:true,
        title: "Actions",
        closable:true,
        titleCollapse:true,
        html: actionsContent,
        buttons: [{
        	text: 'View',
            handler: function() {
                var win = new Ext.Window({
                    layout      : 'fit',
                    autoWidth   : true,
                    autoHeight	: true,
                    closeAction :'hide',
                    plain       : true,
                    stateful    : false,
                    modal		: true,
                    buttons: [{
                        text     : 'Close',
                        handler  : function(){
                            win.hide();
                        }
                    }],
                	html: '<embed src="https://128.164.80.81/ds2/web/media/DS2_Actions.mov" width="1200" height="700"></embed>',
                })
                win.show(); 
        	}
        }]
	})
	
	reportsContent = "This video will demonstrate using the reports menu so users can view and generate reports within Dragonslayer.";
	
	reportsPanel = new Ext.Panel({
        frame:true,
        title: "Reports",
        closable:true,
        titleCollapse:true,
        html: reportsContent,
        buttons: [{
        	text: 'View',
            handler: function() {
                var win = new Ext.Window({
                    layout      : 'fit',
                    autoWidth   : true,
                    autoHeight	: true,
                    closeAction :'hide',
                    plain       : true,
                    stateful    : false,
                    modal		: true,
                    buttons: [{
                        text     : 'Close',
                        handler  : function(){
                            win.hide();
                        }
                    }],
                	html: '<embed src="https://128.164.80.81/ds2/web/media/DS2_Reports.mov" width="1200" height="700"></embed>',
                })
                win.show(); 
        	}
        }]
	})
	
	launchersContent = "This video will demonstrate using the launchers menu so users can have an understanding of what each launcher does within Dragonslayer.";
	
	launchersPanel = new Ext.Panel({
        frame:true,
        title: "Reports",
        closable:true,
        titleCollapse:true,
        html: launchersContent,
        buttons: [{
        	text: 'View',
            handler: function() {
                var win = new Ext.Window({
                    layout      : 'fit',
                    autoWidth   : true,
                    autoHeight	: true,
                    closeAction :'hide',
                    plain       : true,
                    stateful    : false,
                    modal		: true,
                    buttons: [{
                        text     : 'Close',
                        handler  : function(){
                            win.hide();
                        }
                    }],
                	html: '<embed src="https://128.164.80.81/ds2/web/media/DS2_Launchers.mov" width="1200" height="700"></embed>',
                })
                win.show(); 
        	}
        }]
	})
	
	casesContent = "This video will demonstrate creating cases within Dragonslayer and using the Dragon interface.";
	
	casesPanel = new Ext.Panel({
        frame:true,
        title: "Cases",
        closable:true,
        titleCollapse:true,
        html: casesContent,
        buttons: [{
        	text: 'View',
            handler: function() {
                var win = new Ext.Window({
                    layout      : 'fit',
                    autoWidth   : true,
                    autoHeight	: true,
                    closeAction :'hide',
                    plain       : true,
                    stateful    : false,
                    modal		: true,
                    buttons: [{
                        text     : 'Close',
                        handler  : function(){
                            win.hide();
                        }
                    }],
                	html: '<embed src="https://128.164.80.81/ds2/web/media/DS2_Cases.mov" width="1200" height="700"></embed>',
                })
                win.show(); 
        	}
        }]
	})	
	 
    SampleApp.Videos.Panel.superclass.constructor.call(this,{
        frame:true,
        title: "Training Videos",
        closable:true,
        titleCollapse:true,
        items: [authPanel, portletPanel, queriesPanel, actionsPanel, reportsPanel, launchersPanel, casesPanel]
    });
};

/**
 *   
 */
Ext.extend(SampleApp.Videos.Panel, Ext.Panel, {
});