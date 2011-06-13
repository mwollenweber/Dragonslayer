Ext.namespace("SampleApp.Logger");

/**
 * Attach the logger to the south panel
 */
Ext.onReady(function(){
    var loggerPanel = new SampleApp.Logger.Panel();
    SampleApp.Main.SouthPanelInstance.add(loggerPanel);
    SampleApp.Main.SouthPanelInstance.activate(loggerPanel);
    
    SampleApp.Main.EventRelay.on("log",loggerPanel.logMessage,loggerPanel);
});

/**
 * Logger Panel - allows other components to log generic messages
 */
SampleApp.Logger.Panel = function(config) {

    Ext.apply(this,config);

    SampleApp.Logger.Panel.superclass.constructor.call(this,{
        autoScroll:true,
        title:'Logger',
        padding: "0px 0px 0px 5px",
        html: '',
        closable: false,
        logMessages: [],
    });
};

/**
 * Logger Panel 
 */
Ext.extend(SampleApp.Logger.Panel, Ext.Panel, {
    logMessage: function(logMessage,e){
        logMessage["timestamp"] = new Date();
        this.logMessages.push(logMessage)
        this.updateLogDisplay();
    },
    updateLogDisplay: function(){
        var logHtmlArray = this.logMessages.map(function(logMessage){
            return this.formatLogMessage(logMessage);
        },this);
        this.update(logHtmlArray.join("<br />\n"));

        var bottom = this.el.getHeight();
        this.body.scroll("b", bottom, true); 

    },
    formatLogMessage: function(logMessage){
        var message = logMessage["message"];
        var severity = logMessage["severity"];
        var from = logMessage["from"];
        var timestamp = logMessage["timestamp"];
        
        var color = this.getSeverityColor(severity);
        var outputMessage = severity.toUpperCase() + " | " + timestamp.format("m/d/y G:i:s") + " | " + from + " | " + message;
        return "<span style='color:"+color+"'>"+outputMessage+"</span>";
    },
    getSeverityColor: function(severity) {
        var color = "black";
        if (severity == "error")
            color = "red";
        else if (severity == "warning")
            color = "#FFB500"; /* Yellow */
        else if (severity == "info")
            color = "#66BC00"; /* Green */
        else if (severity == "debug")
            color = "#888888";
        return color;
    },
});