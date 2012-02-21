/**
 * Basic event register
 * @description this file will register a handler to the link representing the coresponding panel. when the link is clicked, the handler will fire and perform the specified operation (loading that panel)
 */

Ext.namespace("SampleApp.Reports");

/**
 * Attach the Reports panel to the West Panel
 */
Ext.onReady(function(){
    var reportsPanel = new SampleApp.Reports.Panel();
    SampleApp.Main.WestPanelInstance.add(reportsPanel);
    SampleApp.Main.WestPanelInstance.doLayout();
    
    SampleApp.Main.EventRelay.fireEvent("log",{
        severity: "info",
        from: "reports.js",
        message: "Reports panel loaded",
    });
});


/**
 * Panel that contains links for opening new tabs in the center panel
 */
SampleApp.Reports.Panel = function() {

    SampleApp.Reports.Panel.superclass.constructor.call(this,{
        frame:true,
        title:"Reports",
        contentEl:"dragonslayer-reports-content",
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
Ext.extend(SampleApp.Reports.Panel, Ext.Panel, {
    linkClicked : function(event,element) {
        /** The event name we want to fire is stored in the "a" tag's name attribute */
        var eventName = element.name;
        SampleApp.Main.EventRelay.fireEvent(eventName);
    }
});
