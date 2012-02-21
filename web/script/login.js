/**
 * login.js
 * @author Brandon Dixon
 * @description authenticates user against remote PHP script using AJAX
 */

Ext.onReady(function(){
	Ext.QuickTips.init();

	//toolbar to append to the login window
    copy_tbar = new Ext.Toolbar.TextItem({
        text: 'Copyright Matthew Wollenweber, Brandon Dixon 2011',
    })
	
    //handles the AJAX login fucntionality 
	function process_login(form_data) {
        Ext.Ajax.request({
    		url:'controls/authentication/validate.php', 
            method:'POST', 
            waitTitle:'Connecting', 
            waitMsg:'Sending data...',
            params: form_data,
            
            success:function(request){ 
            	obj = Ext.util.JSON.decode(request.responseText); 
         		if(obj.success == "true") {
        			var redirect = 'index.php'; 
                    window.location = redirect;
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

    //Basic form panel to take user input
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
        ],
  
        buttons:[{ 
	        text:'Login',
	        formBind: true,	 
	        handler:function(){ 
	        	var form_data = login.getForm().getValues();
	        	process_login(form_data);
	        } 
        },
        {
        	text:'Register',
        	handler:function(){  //handle registration in its own file
        		window.location = 'register.php';
        	}
        }
        ],
        keys: [
           { key: [Ext.EventObject.ENTER], handler: function() { //capture the enter key and associate that with a form submission
        	   var form_data = login.getForm().getValues();
        	   process_login(form_data)
               }
           }
        ],
    });
    
    var win = new Ext.Window({
        layout:'fit',
        width:300,
        closable: false,
        resizable: false,
        plain: true,
        border: false,
        draggable: false,
		bbar: [copy_tbar],
		items: [login]
	});
	win.show();
});
