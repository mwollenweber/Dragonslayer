SearchByIpPortlet = function() {

    searchByIpFormPanel = new SampleApp.SearchByIpPortlet.FormPanel(); //Create the form panel for the search box
	
	SampleApp.SearchByIpPortlet.FormPanel = function(){

		SampleApp.SearchByIpPortlet.categories = [
	       ['dsid', 'DSID'],
	       ['analyst', 'Analyst'],
	       ['netid', 'NetID'],
	       ['dragon_event', 'Event'],
	       ['victim_ip', 'Victim IP'],
	       ['attacker_ip', 'Attacker IP'],
	       ['network', 'Network'],
	       ['text_in_verification', 'Text in Verification'],
	   ];
		
		SampleApp.SearchByIpPortlet.FormPanel.superclass.constructor.call(this,{
			frame:true,
	        buttonAlign : 'left',
	        bodyStyle:'padding:5px 5px 0',
	        defaultType: 'textfield',
	        items: [
	            new Ext.form.ComboBox({
	                fieldLabel: 'Type',
	                name: 'type',
	                hiddenName: 'search_type',
	                width: 300,
	                store: new Ext.data.ArrayStore({
	                    fields: ['code', 'search_type'],
	                    data : SampleApp.SearchByIp.categories
	                }),
	                valueField:'code',
	                displayField:'search_type',
	                typeAhead: true,
	                allowBlank:false,
	                mode: 'local',
	                triggerAction: 'all',
	                emptyText:'Select a type...',
	            }),
	            {
	                fieldLabel: 'Value',
	                name: 'search_value',
	                allowBlank:false,
	                width: 300
	            },
	        ],

	        buttons: [{
	            text: 'Search',   
	            formBind: true,	 
	            handler:function(){ 
	            	var search_type = searchByIpFormPanel.getForm().findField('search_type');
	            	var search_value = searchByIpFormPanel.getForm().findField('search_value');
	            	
	            	alert(search_type);
	            },
	        }],
	        keys: [
	               { key: [Ext.EventObject.ENTER], handler: function() {
		            	var search_type = searchByIpFormPanel.getForm().findField('search_type');
		            	var search_value = searchByIpFormPanel.getForm().findField('search_value');
	                   }
	               }
	           ],
	        region: "north",
	        height: 100
	    });
	}
	
	SearchByIpPortlet.superclass.constructor.call(this, {
        height: 95,
        items: [searchByIpFormPanel]
    });
}

Ext.extend(SearchByIpPortlet, Ext.Panel);