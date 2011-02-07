Ext.onReady(function(){
	Ext.QuickTips.init();
	
	var register = new Ext.form.FieldSet({
        checkboxToggle:true,
        title: 'Register',
        id:'register_check',
        autoHeight:true,
        defaults: {width: 210},
        defaultType: 'textfield',
        collapsed: true,
		items:[{
                    fieldLabel: 'First Name',
                    name: 'first',
                },{
                    fieldLabel: 'Last Name',
                    name: 'last'
                },{
                    fieldLabel: 'Username',
                    name: 'username'
                },{
                    fieldLabel: 'Email',
                    name: 'email',
                    vtype:'email'
                },{
                	fieldLabel: 'Password',
                	name: 'password',
                	inputType:'password', 
                },{
                	fieldLabel: 'Confirm Password',
                	name: 'confirm_password',
                	inputType:'password', 
                }
        ]
	})
 
	var login = new Ext.FormPanel({ 
		labelWidth:80,
		frame:true, 
		title:'Please Login', 
		defaultType:'textfield',
		monitorValid:true,
		autoHeight:true,

        items:[{ 
                fieldLabel:'Username', 
                name:'loginUsername', 
                allowBlank:false 
            },{ 
                fieldLabel:'Password', 
                name:'loginPassword', 
                inputType:'password', 
                allowBlank:false 
            },
//            register
        ],
  
        buttons:[{ 
	        text:'Login',
	        formBind: true,	 
	        handler:function(){ 
	        	var form_data = login.getForm().getValues();
	            Ext.Ajax.request({
	        		url:'controls/authentication/validate.php', 
	                method:'POST', 
	                waitTitle:'Connecting', 
	                waitMsg:'Sending data...',
	                params: form_data,
	                
                    success:function(request){ 
                    	obj = Ext.util.JSON.decode(request.responseText); 
                 		if(obj.success == "true") {
                    		Ext.Msg.alert('Status', 'Login Successful!', function(btn, text){
                    			var redirect = 'index.php'; 
    	                        window.location = redirect;
                    		});
                 		} else {
                 			Ext.Msg.alert('Status', 'Login Failed!');
                 		}
                    },
	 
                    failure:function(form, action){ 
                            if(action.failureType == 'server'){ 
	                        obj = Ext.util.JSON.decode(action.response.responseText); 
	                        Ext.Msg.alert('Login Failed!', obj.errors.reason); 
	                    }else{ 
	                        Ext.Msg.alert('Warning!', 'Authentication server is unreachable : ' + action.response.responseText); 
	                    } 
	                    login.getForm().reset(); 
	                } 
	            }); 
	        } 
        },
        {
        	text:'Register',
        	handler:function(){ 
        		window.location = 'register.php';
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
        items: [login]
	});
	win.show();
});