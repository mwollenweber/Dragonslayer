Ext.namespace("SampleApp.Status");

/**
 * Attach the launcher panel to the West Panel
 */
Ext.onReady(function(){
    SampleApp.Main.EventRelay.on("openHealthStatus",SampleApp.Status.Open);
});

/**
 * Event handler
 */
SampleApp.Status.Open = function() {
    var StatusPanel = new SampleApp.Status.Panel();
    SampleApp.Main.CenterPanelInstance.add(StatusPanel);
    SampleApp.Main.CenterPanelInstance.activate(StatusPanel);
    
    SampleApp.Main.EventRelay.fireEvent("log",{
        severity: "info",
        from: "dragon_interface.js",
        message: "DS Status",
    });
}

/**
 * 
 */
SampleApp.Status.Panel = function() {
	
    var myData = Ext.Ajax.request({
        url: 'controls/health/status.php',
        method:'GET', 
        waitTitle:'Connecting', 
        waitMsg:'Getting data...',
        
        success:function(request){ 
        	var obj = Ext.util.JSON.decode(request.responseText); 
        	content = "<b>Testing:</b>" + obj.dragon_working_count;
        	Ext.getCmp('health_panel_data').setText(content);  
       },
	});
    
	healthData = "This video will demonstrate how to login and register to DragonSlayer.";
	
	overallHealthPanel = new Ext.Panel({
        frame:true,
        id:'health_panel_data',
        html: healthData,
	})
	 
    SampleApp.Status.Panel.superclass.constructor.call(this,{
        frame:true,
        title: "Health Status",
        closable:true,
        titleCollapse:true,
        items: [overallHealthPanel]
    });
};

/**
 *   
 */
Ext.extend(SampleApp.Status.Panel, Ext.Panel, {
});