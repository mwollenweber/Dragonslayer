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
	
	SampleApp.GenerateReport.categories = [
	   	                          ['pop-up', 'Pop-up'],
	   	                          ['download', 'Download'],
	   	                      ];
	
    var report_format = new Ext.form.ComboBox({
        fieldLabel: 'Format',
        name: 'format',
        width: 300,
        store: new Ext.data.ArrayStore({
            fields: ['code', 'category'],
            data : SampleApp.GenerateReport.categories
        }),
        valueField:'code',
        displayField:'category',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        emptyText:'Select a format...',
        allowBlank:false,
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
			date_end,
			report_format
        ],
        buttons: [{
            text: 'Generate',
            handler: function(){
            	start = (new Date(date_start.getValue())).format('Y-m-d');
            	end = (new Date(date_end.getValue())).format('Y-m-d');
            	format = report_format.getValue();
            	if(format == "download") {
                	url = 'https://128.164.80.81/ds2/web/controls/reports/generate_weekly_report_download.php?start_date=' + start + '&end_date=' + end;
                	window.location = url;
            	} else {
                	SampleApp.DisplayReport.Open(start,end);
            	}

            	GenerateReportPanel.close();
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