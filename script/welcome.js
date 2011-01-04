Ext.namespace('SampleApp.Welcome');

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

/**
 * Welcome Panel - contains a welcoming message
 */
SampleApp.Welcome.Panel = function(config) {
    Ext.apply(this,config);
    var header = "<h1>Sample Modular ExtJS Application </h1>";
    var text = "<p>Click around to get a feel for the appliction, then view the source and see how things are put together!  The Chat and Address book components aren't actually functional, they are just being used as placeholders.</p>";
    
    SampleApp.Welcome.Panel.superclass.constructor.call(this,{
        frame:true,
        layout: "fit",
        title:'Welcome',
        closable: false,
        html: header + text
    });
};

/**
 * Welcome Panel
 */
Ext.extend(SampleApp.Welcome.Panel, Ext.Panel, {
});

