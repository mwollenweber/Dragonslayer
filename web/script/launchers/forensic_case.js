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
	
	/*
	 * Begin SCP Info
	 */
	var scp_conf_exp = new Ext.form.TextArea({
        fieldLabel: 'Explanation',
        name: 'scp_conf_exp',
        allowBlank:true,
        anchor:'100%'
	});
	
	var scp_conf_tak_exp = new Ext.form.TextArea({
        fieldLabel: 'Explanation',
        name: 'scp_conf_tak_exp',
        allowBlank:true,
        anchor:'100%'
	});
	
	var scp_conf_info = new Ext.form.FieldSet({
        title: 'Information present?',
        checkboxToggle:true,
        autoHeight:true,
        items :[scp_conf_exp]
	});
	
	var scp_conf_info_taken = new Ext.form.FieldSet({
        title: 'Information taken?',
        checkboxToggle:true,
        autoHeight:true,
        items :[scp_conf_tak_exp]
	});
	
	
	var scp_fieldset = new Ext.form.FieldSet({
         title: 'Sensative, Confidential, or PII',
         collapsible: true,
         autoHeight:true,
         items :[scp_conf_info, scp_conf_info_taken]
	});
	
	/*
	 * Begin Causation and Mitigation
	 * 
	 */
	
	var cm_av_type = new Ext.form.TextField({
		fieldLabel: 'Anti-virus type',
        name: 'cm_av_type',
        anchor:'100%'
	});
	
	var cm_stop_threat = new Ext.form.Checkbox({
		fieldLabel: 'Did it stop the threat?',
        name: 'cm_stop_threat',
        anchor:'100%'
	});
	
	var cm_user_cause = new Ext.form.TextArea({
		fieldLabel: 'Did user cause this?',
        name: 'cm_user_cause',
        anchor:'100%'
	});
	
	var cm_user_prevent = new Ext.form.TextArea({
		fieldLabel: 'Could the user prevented this?',
        name: 'cm_user_prevent',
        anchor:'100%'
	});
	
	var cm_user = new Ext.form.FieldSet({
        title: 'User data',
        checkboxToggle:true,
        autoHeight:true,
        items :[cm_user_cause,cm_user_prevent]
	});
	
	var cm_av_present = new Ext.form.FieldSet({
        title: 'Anti-virus present?',
        checkboxToggle:true,
        autoHeight:true,
        items :[cm_av_type,cm_stop_threat]
	});
	
	var cm_fieldset = new Ext.form.FieldSet({
        title: 'Causation and Mitigation',
        collapsible: true,
        autoHeight:true,
        items :[cm_av_present,cm_user]
	});
	
	
	var fsf = new Ext.FormPanel({
        labelWidth: 75, // label settings here cascade unless overridden
        frame:true,
        bodyStyle:'padding:5px 5px 0',

        items: [
            scp_fieldset,
            cm_fieldset,
        ],

        buttons: [{
            text: 'Save'
        },{
            text: 'Cancel'
        }]
    });
    SampleApp.ForensicCase.Panel.superclass.constructor.call(this,{
        frame:true,
        autoWidth: true,
        title: "Forensic Case",
        closable:true,
        titleCollapse:true,
        items: [fsf]
    });
};

/**
 *   
 */
Ext.extend(SampleApp.ForensicCase.Panel, Ext.Panel, {
});