Ext.namespace("SampleApp.HelperDocs");
var HelperDocsPanel;
var generic_helper_form;

/**
 * Attach the launcher panel to the West Panel
 */
Ext.onReady(function(){
    SampleApp.Main.EventRelay.on("openHelperDocs",SampleApp.HelperDocs.Open);
});

/**
 * Event handler
 */
SampleApp.HelperDocs.Open = function(id,user,role) {
    HelperDocsPanel = new SampleApp.HelperDocs.Panel(id,user,role);
    HelperDocsPanel.show(this);
}

/**
 * 
 */
SampleApp.HelperDocs.Panel = function(id,user,role) {
	var name = '', type = '';
	
	name = id;
	if(name[0] == "p") {
		type = "portlet";
	} else if(name[0] == "t") {
		type = "tab";
	} else if(name[0] == "w") {
		type = "window";
	} else {
		type = "undefined";
	}
	
	var generic_help_field = new Ext.form.TextArea({
        name: 'generic_help',
        width: '100%',
        height: '300',
        hideLabel: true,
	})
	
	var helper_data = Ext.Ajax.request({
	    url: 'controls/helpers/documentation.php',
	    method:'POST',
	    waitTitle:'Connecting', 
	    waitMsg:'Getting data...',
	    params: { type: 'pull', name: name},
	    
	    success:function(request){ 
	    	var obj = Ext.util.JSON.decode(request.responseText); 
	    	generic_help_field.setValue(obj.content);
	    	if(obj.last_edit != null && obj.last_user_edit) {
		    	Ext.getCmp('generic_help_info_bar').setText("Last updated: " + obj.last_edit + " by " + obj.last_user_edit);  
	    	} else {
	    		Ext.getCmp('generic_help_info_bar').setText("Documentation does not exist");  
	    	}
	    },
	});
	
    var generic_help_info_bar = new Ext.Toolbar.TextItem({
        text: '',
        id: 'generic_help_info_bar',
	});
	
    generic_helper_form = new Ext.FormPanel({
		frame:true,
        autoHeight: true,
        buttonAlign : 'right',
        bodyStyle:'padding:5px 5px 0',
        items: [
            generic_help_field
        ],
	});
    
    if(role == "administrator") {
        generic_helper_form.addButton({
            text: 'Save',   
            formBind: true,	 
            handler:function(){ 
            	var helper_data_content = '';
            	helper_data_content = generic_help_field.getValue();
            	Ext.Ajax.request({
        		    url: 'controls/helpers/documentation.php',
        		    method:'POST', 
        		    waitTitle:'Connecting', 
        		    waitMsg:'Sending data...',
        		    params: { type: 'push', name: name, helper_type: type, user: user, content: helper_data_content },
        		    
        		    success:function(request){ 
        		    	Ext.Msg.alert('Success', 'Helper document saved');
        		   },
        		});
            }
    	})
    } else {
    	generic_help_field.readOnly = true;
    }
	
    SampleApp.HelperDocs.Panel.superclass.constructor.call(this,{
    	layout:'fit',
        autoHeight: true,
    	title: 'Help',
		bbar: [generic_help_info_bar],
        width:500,
        closeAction:'hide',
        modal: true,
        items: generic_helper_form
    });
};

/**
 *   
 */
Ext.extend(SampleApp.HelperDocs.Panel, Ext.Window, {
});