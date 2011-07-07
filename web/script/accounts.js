Ext.namespace("SampleApp.Accounts");

/**
 * Attach the Accounts panel to the West Panel
 */
Ext.onReady(function(){
    var AccountsPanel = new SampleApp.Accounts.Panel();
    SampleApp.Main.WestPanelInstance.add(AccountsPanel);
    SampleApp.Main.WestPanelInstance.doLayout();
    
    SampleApp.Main.EventRelay.fireEvent("log",{
        severity: "info",
        from: "Accounts.js",
        message: "Accounts panel loaded",
    });
});


/**
 * Panel that contains links for opening new tabs in the center panel
 */
SampleApp.Accounts.Panel = function() {

    SampleApp.Accounts.Panel.superclass.constructor.call(this,{
        frame:true,
        title:"Accounts",
        contentEl:"dragonslayer-accounts-content",
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
Ext.extend(SampleApp.Accounts.Panel, Ext.Panel, {
    linkClicked : function(event,element) {
        /** The event name we want to fire is stored in the "a" tag's name attribute */
        var eventName = element.name;
        SampleApp.Main.EventRelay.fireEvent(eventName);
    }
});
