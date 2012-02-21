/**
 * Basic event register
 * @description this file will register a handler to the link representing the coresponding panel. when the link is clicked, the handler will fire and perform the specified operation (loading that panel)
 */

Ext.namespace("SampleApp.Health");

/**
 * Attach the Health panel to the West Panel
 */
Ext.onReady(function(){
    var HealthPanel = new SampleApp.Health.Panel();
    SampleApp.Main.WestPanelInstance.add(HealthPanel);
    SampleApp.Main.WestPanelInstance.doLayout();
    
    SampleApp.Main.EventRelay.fireEvent("log",{
        severity: "info",
        from: "Health.js",
        message: "Health panel loaded",
    });
});


/**
 * Panel that contains links for opening new tabs in the center panel
 */
SampleApp.Health.Panel = function() {

    SampleApp.Health.Panel.superclass.constructor.call(this,{
        frame:true,
        title:"Health",
        contentEl:"dragonslayer-health-content",
        titleCollapse:true
    });
    
    this.on("render",function(){
        this.body.on('click', Ext.emptyFn, null, {delegate:'a', preventDefault:true});
        this.body.on('mousedown', this.linkClicked, this, {delegate:'a'});
    },this);
    
};

/**
 *  Application's Center Panel
 */
Ext.extend(SampleApp.Health.Panel, Ext.Panel, {
    linkClicked : function(event,element) {
        /** The event name we want to fire is stored in the "a" tag's name attribute */
        var eventName = element.name;
        SampleApp.Main.EventRelay.fireEvent(eventName);
    }
});
