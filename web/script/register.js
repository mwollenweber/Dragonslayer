Ext.onReady(function(){
	Ext.QuickTips.init();
 
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
	        	if(register.getForm().isValid()){
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
	                 			Ext.Msg.alert('Status', 'Registration Failed!');
	                 		}
	                    },
		            }); 
	        	}
	        } 
        }
    ] 
    });
    
    var win = new Ext.Window({
        layout:'fit',
        width:300,
        closable: false,
        resizable: false,
        plain: true,
        border: false,
        draggable: false,
        items: [register]
	});
	win.show();
});