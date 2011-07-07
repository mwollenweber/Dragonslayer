function SearchByTypePortlet(){
	
	SearchByTypePortlet.categories = [
       ['dsid', 'DSID'],
       ['analyst', 'Analyst'],
       ['netid', 'NetID'],
       ['dragon_event', 'Event'],
       ['victim_ip', 'Victim IP'],
       ['attacker_ip', 'Attacker IP'],
       ['network', 'Network'],
       ['text_in_verification', 'Text in Verification'],
   ];
	
	var search_type_field = new Ext.form.ComboBox({
		fieldLabel: 'Type',
		name: 'type',
		hiddenName: 'search_type',
		width: 300,
		store: new Ext.data.ArrayStore({
		    fields: ['code', 'search_type'],
		    data : SearchByTypePortlet.categories
		}),
		valueField:'code',
		displayField:'search_type',
		typeAhead: true,
		allowBlank:false,
		mode: 'local',
		triggerAction: 'all',
		emptyText:'Select a type...',
    });
	
	var search_value_field = new Ext.form.TextField({
        fieldLabel: 'Value',
        name: 'search_value',
        allowBlank:false,
        width: 300
	})
	
	SearchByTypePortlet.superclass.constructor.call(this, {
		frame:true,
        buttonAlign : 'left',
        bodyStyle:'padding:5px 5px 0',
        defaultType: 'textfield',
        items: [
            search_type_field,
            search_value_field
        ],

        buttons: [{
            text: 'Search',   
            formBind: true,	 
            handler:function(){ 
            	var search_type = search_type_field.getValue();
            	var search_value = search_value_field.getValue();
            	SampleApp.SearchByIp.PivotSearch(search_type, search_value);
            },
        }],
        keys: [
               { key: [Ext.EventObject.ENTER], handler: function() {
	               	var search_type = search_type_field.getValue();
	            	var search_value = search_value_field.getValue();
	            	SampleApp.SearchByIp.PivotSearch(search_type, search_value);
                   }
               }
           ],
        region: "north",
        height: 100
    });
}

Ext.extend(SearchByTypePortlet, Ext.FormPanel);