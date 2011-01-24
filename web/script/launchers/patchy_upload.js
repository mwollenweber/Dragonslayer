Ext.namespace("SampleApp.PatchyUpload");
var patchyUploadPanel;

/**
 * Attach the launcher panel to the West Panel
 */
Ext.onReady(function(){
    SampleApp.Main.EventRelay.on("openPatchyUpload",SampleApp.PatchyUpload.Open);
});

/**
 * Event handler
 */
SampleApp.PatchyUpload.Open = function() {
    patchyUploadPanel = new SampleApp.PatchyUpload.Panel();
    patchyUploadPanel.show(this);
    
    SampleApp.Main.EventRelay.fireEvent("log",{
        severity: "info",
        from: "dragon_interface.js",
        message: "Patchy Upload Opened",
    });
}

/**
 * 
 */
SampleApp.PatchyUpload.Panel = function() {
	
	patchy_form = new Ext.FormPanel({
		fileUpload: true,
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
//                {
//            xtype: 'fileuploadfield',
//            emptyText: 'Select patchy file..',
//            fieldLabel: 'Patchy File',
//            name: 'patchy_file',
//            allowBlank: false,
//        }

{
            xtype: 'textfield',
            fieldLabel: 'Name'
        },{
            xtype: 'fileuploadfield',
            id: 'form-file',
            emptyText: 'Select an image',
            fieldLabel: 'Photo',
            name: 'patchy_file',
            buttonText: '',
            buttonCfg: {
                iconCls: 'upload-icon'
            }
        }
                ],
        buttons: [{
            text: 'Save',
            handler: function(){
            	var form_data = patchy_form.getForm().getValues();
            	if(patchy_form.getForm().isValid()){
	            	patchy_form.getForm().submit({
//	                    url: '../code/psp/submit_patchy.psp',
	            		url: 'controls/file_test.php',
	                    waitMsg: 'Uploading patchy file...',
	                    success: function(fp, o){
	                    	Ext.Msg.alert('Success');
	                    }
	                });
            		
//            		Ext.Ajax.request({
//	            		url: 'controls/file_test.php',
//				        method:'POST', 
//				        waitTitle:'Connecting', 
//				        waitMsg:'Getting data...',
//				        params: form_data,
//				        
//				        success:function(request){ 
//				        	var obj = Ext.util.JSON.decode(request.responseText);
//				        	if(obj.success == "true") {
//				        		Ext.Msg.alert('Success','Case created');
//				        	} else {
//				        		Ext.Msg.alert('Case creation failed', obj.error); 
//				        	}
//				       },
//					});
            	}
            }
        },{
            text: 'Reset',
            handler: function(){
            	patchy_form.getForm().reset();
            }
        }]
	});
	
    SampleApp.PatchyUpload.Panel.superclass.constructor.call(this,{
    	layout:'fit',
    	title: 'Patchy File Uploader',
        width:500,
        closeAction:'hide',
        modal: true,
        items: patchy_form
    });
};

/**
 *   
 */
Ext.extend(SampleApp.PatchyUpload.Panel, Ext.Window, {
});