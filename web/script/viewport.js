Ext.namespace("SampleApp.Main");

/**
 * Instantiate the Viewport
 */
Ext.onReady(function(){
    var viewPort = new Ext.Viewport({
        layout: 'border',
        items : [
            SampleApp.Main.CenterPanelInstance,
            SampleApp.Main.WestPanelInstance,
            SampleApp.Main.SouthPanelInstance,
        ]
    });   
});

/**
 * Object for passing generic messages
 */
SampleApp.Main.EventRelay = new Ext.util.Observable();

/**
 * Application's Center Panel
 */
SampleApp.Main.CenterPanel = function() {

    SampleApp.Main.CenterPanel.superclass.constructor.call(this, {
        id:'main',
        region:'center',
        margins: '0 5 5 0',
        minTabWidth: 115,
        resizeTabs: true,
        enableTabScroll: true,
        defaults: {autoScroll: true},
        activeTab: 0,
	items:[]
    });
};

/**
 *  Application's Center Panel
 */
Ext.extend(SampleApp.Main.CenterPanel, Ext.TabPanel, {
});

/**
 * Application's West Panel
 */
SampleApp.Main.WestPanel = function() {
    SampleApp.Main.WestPanel.superclass.constructor.call(this, {
    title: 'Menu',
    id:'info',
    region:'west',
    split:true,
    width:200,
    minSize:100,
    maxSize:400,
    collapsible:true,
    margins:'0 0 5 5',
    cmargins:'0 0 0 0',
    items: []
    });
};

/**
 * Application's West Panel
 */
Ext.extend(SampleApp.Main.WestPanel, Ext.Panel, {
});

/**
 * Application's South Panel
 */
SampleApp.Main.SouthPanel = function(){
	
    copy_tbar = new Ext.Toolbar.TextItem({
        text: 'Copyright Matthew Wollenweber, Brandon Dixon 2011',
    })
	
    SampleApp.Main.SouthPanel.superclass.constructor.call(this, {
        id:'south-panel',
        region: 'south',
        bbar: [copy_tbar]
    });
};

/**
 *  Application's South Panel
 */
Ext.extend(SampleApp.Main.SouthPanel, Ext.TabPanel, {
});

/**
 * Global Viewport sub-panel instances
 */
SampleApp.Main.CenterPanelInstance = new SampleApp.Main.CenterPanel();
SampleApp.Main.WestPanelInstance = new SampleApp.Main.WestPanel();
SampleApp.Main.SouthPanelInstance = new SampleApp.Main.SouthPanel();
