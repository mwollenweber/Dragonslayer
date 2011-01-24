Ext.namespace("SampleApp.ForensicCase");

/**
 * Attach the launcher panel to the West Panel
 */
Ext.onReady(function(){
    SampleApp.Main.EventRelay.on("openForensicCase",SampleApp.ForensicCase.Open);
});

/**
 * Event handler
 */
SampleApp.ForensicCase.Open = function() {
    var forensicCasePanel = new SampleApp.ForensicCase.Panel();
    SampleApp.Main.CenterPanelInstance.add(forensicCasePanel);
    SampleApp.Main.CenterPanelInstance.activate(forensicCasePanel);
    
    SampleApp.Main.EventRelay.fireEvent("log",{
        severity: "info",
        from: "dragon_interface.js",
        message: "Forensic Case Opened",
    });
}

/**
 * 
 */
SampleApp.ForensicCase.Panel = function() {
    SampleApp.ForensicCase.Panel.superclass.constructor.call(this,{
        frame:true,
        title: "Forensic Case",
        closable:true,
        titleCollapse:true,
        layout: 'fit',
        html: "Form content"
    });
};

/**
 *   
 */
Ext.extend(SampleApp.ForensicCase.Panel, Ext.Panel, {
});