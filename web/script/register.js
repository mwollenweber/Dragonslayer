/**
 * register.js
 * @author Brandon Dixon
 * @description builds a simple register form connected to a window to register users
 */

Ext.onReady(function(){
	Ext.QuickTips.init();
 
	//toolbar appended to the bottom of the register window
    copy_tbar = new Ext.Toolbar.TextItem({
        text: 'Copyright Matthew Wollenweber, Brandon Dixon 2011',
    })

    //main form panel used for the registration
	var register = new Ext.FormPanel({ 
		labelWidth:80,
		frame:true, 
		title:'Register', 
		defaultType:'textfield',
		monitorValid:true,
		autoHeight:true,
        items:[
			{
			    fieldLabel: 'First Name',
			    name: 'first',
			    allowBlank:false,
			},{
			    fieldLabel: 'Last Name',
			    name: 'last',
			    allowBlank:false,
			},{
			    fieldLabel: 'Username',
			    name: 'username',
			    allowBlank:false,
			},{
			    fieldLabel: 'Email',
			    name: 'email',
			    vtype:'email',
			    allowBlank:false,
			},{
				fieldLabel: 'Password',
				name: 'password',
				inputType:'password', 
				allowBlank:false,
			},{
				fieldLabel: 'Confirm Password',
				name: 'confirm_password',
				inputType:'password', 
				allowBlank:false,
			}
        ],
  
        buttons:[{
        	text:'Register',
        	handler:function(){ 
	        	var form_data = register.getForm().getValues();
	        	if(register.getForm().isValid()){ //local checks validate successfully
		            Ext.Ajax.request({
		        		url:'controls/authentication/register_user.php', 
		                method:'POST', 
		                waitTitle:'Connecting', 
		                waitMsg:'Sending data...',
		                params: form_data,
		                
	                    success:function(request){ 
	                    	obj = Ext.util.JSON.decode(request.responseText); 
	                 		if(obj.success == "true") {
	                			var redirect = 'login.php'; 
		                        window.location = redirect;
	                 		} else {
	                 			Ext.Msg.alert('Registration Failed!', obj.error);
	                 		}
	                    },
		            }); 
	        	}
	        } 
        }
    ] 
    });
    
    //attach the form to a window
    var win = new Ext.Window({
        layout:'fit',
        width:300,
        closable: false,
        resizable: false,
        plain: true,
        border: false,
        draggable: false,
        bbar: [copy_tbar],
        items: [register]
	});
	win.show(); //use the show method to actually bring the window to the front
});
