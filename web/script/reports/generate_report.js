Ext.namespace("SampleApp.GenerateReport");
var GenerateReportPanel;

/**
 * Attach the launcher panel to the West Panel
 */
Ext.onReady(function(){
    SampleApp.Main.EventRelay.on("openGenerateReport",SampleApp.GenerateReport.Open);
});

/**
 * Event handler
 */
SampleApp.GenerateReport.Open = function() {
    GenerateReportPanel = new SampleApp.GenerateReport.Panel();
    GenerateReportPanel.show(this);
}

/**
 * 
 */
SampleApp.GenerateReport.Panel = function() {
	
	date_start = new Ext.form.DateField({
        fieldLabel: 'Start Date',
        name: 'start_date',
        allowBlank:false,
        width: 300,
        format: 'm/d/Y',
	});
	
	date_end = new Ext.form.DateField({
        fieldLabel: 'End Date',
        name: 'end_date',
        allowBlank:false,
        width: 300,
        format: 'm/d/Y',
	});
	
	report_form = new Ext.FormPanel({
        width: 500,
        frame: true,
        autoHeight: true,
        bodyStyle: 'padding: 10px 10px 0 10px;',
        labelWidth: 50,
        defaults: {
            anchor: '95%',
            allowBlank: false,
            msgTarget: 'side'
        },
        items: [
			date_start,
			date_end
        ],
        buttons: [{
            text: 'Generate',
            handler: function(){
            	start = (new Date(date_start.getValue())).format('Y-m-d');
            	end = (new Date(date_end.getValue())).format('Y-m-d');
            	url = 'https://128.164.80.105/ds2/web/controls/reports/generate_weekly_report_download.php?start_date=' + start + '&end_date=' + end;
            	window.location = url;
            	GenerateReportPanel.close();
            	
//            	if(report_form.getForm().isValid()){
//            		report_form.getForm().submit({
//	            		url: 'controls/reports/generate_weekly_report_download.php',
//	            		method: 'post',
//	                    waitMsg: 'Generating report...',
//	                    success: function(fp, o){
//	                    	GenerateReportPanel.close();
//	                    }
//	                });
//            	}
            }
        },{
            text: 'Reset',
            handler: function(){
            	report_form.getForm().reset();
            }
        }]
	});
	
    SampleApp.GenerateReport.Panel.superclass.constructor.call(this,{
    	layout:'fit',
    	title: 'Report Generator',
        width:500,
        closeAction:'hide',
        modal: true,
        items: report_form
    });
};

/**
 *   
 */
Ext.extend(SampleApp.GenerateReport.Panel, Ext.Window, {
});