Ext.namespace("SampleApp.DisplayReport");
var DisplayReportPanel;
var start_date = '', end_date = '';

/**
 * Attach the launcher panel to the West Panel
 */
Ext.onReady(function(){
    SampleApp.Main.EventRelay.on("openDisplayReport",SampleApp.DisplayReport.Open);
});

/**
 * Event handler
 */
SampleApp.DisplayReport.Open = function(sdate, edate) {
	start_date = sdate;
	end_date = edate;
    DisplayReportPanel = new SampleApp.DisplayReport.Panel();
    DisplayReportPanel.show(this);
}

/**
 * 
 */
SampleApp.DisplayReport.Panel = function() {
	
    SampleApp.DisplayReport.Panel.superclass.constructor.call(this,{
    	layout:'fit',
    	title: 'Compromise Report',
        closeAction:'hide',
        modal: true,
        autoLoad: 'https://128.164.80.81/ds2/web/controls/reports/generate_weekly_report_display.php?start_date=' + start_date + '&end_date=' + end_date
    });
};

/**
 *   
 */
Ext.extend(SampleApp.DisplayReport.Panel, Ext.Window, {
});