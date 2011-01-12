SearchByIpPortlet = function() {

    searchByIpFormPanel = new SampleApp.SearchByIp.FormPanel(); //Create the form panel for the search box
	
	SampleApp.SearchByIp.FormPanel = function(){
		SampleApp.SearchByIp.FormPanel.superclass.constructor.call(this,{
	        frame:false,
	        buttonAlign : 'left',
	        bodyStyle:'padding:5px 5px 0',

	        defaultType: 'textfield',
	        items: [{
	                fieldLabel: 'IP Address',
	                name: 'ip_address',
	                allowBlank:false
	            },
	        ],
	
	        buttons: [{
	            text: 'Search',   
	            formBind: true,	 
	            handler:function(){ 
	            	var form_data = searchByIpFormPanel.getForm().getValues();
	            	Ext.Ajax.request({
	            		url: 'controls/actions/search_by_ip.php',
				        method:'POST', 
				        waitTitle:'Connecting', 
				        waitMsg:'Getting data...',
				        params: form_data,
				        
				        success:function(request){ 
				        	var obj = Ext.util.JSON.decode(request.responseText);
				        	store.loadData(obj);
				       },
					});
	            },
	        }],
	        region: "north",
	    });
	}
	
	SearchByIpPortlet.superclass.constructor.call(this, {
        height: 95,
        items: [searchByIpFormPanel]
    });
}

Ext.extend(SearchByIpPortlet, Ext.Panel);