/**
 * Documentation Hooks
 * @description this file will serve as the hooking and generator for documentation. 
 */

Ext.namespace("SampleApp.HelperDocs");
var HelperDocsPanel;
var generic_helper_form;

/**
 * Observer event listening for the button that triggers the call to "open" the helper docs
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
 * Panel builder - output displayed to the user
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
	
	//makes a request for any existing data for the current helper doc
	var helper_data = Ext.Ajax.request({
	    url: 'controls/helpers/documentation.php',
	    method:'POST',
	    waitTitle:'Connecting', 
	    waitMsg:'Getting data...',
	    params: { type: 'pull', name: name},
	    
	    //bottom toolbar should reflect the output of this success handler
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
    
    //present the ability to edit and save documentation if the user is an administrator
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
	
    //window configuration that takes into account all items declared above
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
 * Tell EXT that our panel is merely an extension of the Window class
 */
Ext.extend(SampleApp.HelperDocs.Panel, Ext.Window, {
});