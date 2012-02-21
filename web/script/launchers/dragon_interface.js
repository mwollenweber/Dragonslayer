Ext.namespace("SampleApp.DragonInterface");

/**
 * Attach the launcher panel to the West Panel
 */
Ext.onReady(function(){
    SampleApp.Main.EventRelay.on("openDragonInterface",SampleApp.DragonInterface.Open);
});

/**
 * Event handler
 */
SampleApp.DragonInterface.Open = function() {
    var dragonInterfacePanel = new SampleApp.DragonInterface.Panel();
    SampleApp.Main.CenterPanelInstance.add(dragonInterfacePanel);
    SampleApp.Main.CenterPanelInstance.activate(dragonInterfacePanel);
    
    SampleApp.Main.EventRelay.fireEvent("log",{
        severity: "info",
        from: "dragon_interface.js",
        message: "Dragon Interface Opened",
    });
}

/**
 * DragonInterface Panel - shows the iframe with Dragon in it
 */
SampleApp.DragonInterface.Panel = function() {
    SampleApp.DragonInterface.Panel.superclass.constructor.call(this,{
        frame:true,
        title: "Dragon Interface",
        closable:true,
        titleCollapse:true,
        layout: 'fit',
        html: "<iframe height=100% width=100% src='https://128.164.11.22:9443'></iframe>" //hardcoded URLs are bad juju
    });
};

/**
 *   
 */
Ext.extend(SampleApp.DragonInterface.Panel, Ext.Panel, {
});