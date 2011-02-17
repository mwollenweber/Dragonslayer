function ScratchPadPortlet(){
	
	var scratch_value_field = new Ext.form.TextArea({
        name: 'scratch_value',
        width: '100%',
        height: 200,
        hideLabel: true,
	})
	
	var scratch_data = Ext.Ajax.request({
	    url: 'controls/actions/scratch_pad.php',
	    method:'POST',
	    waitTitle:'Connecting', 
	    waitMsg:'Getting data...',
	    params: { type: 'pull' },
	    
	    success:function(request){ 
	    	var obj = Ext.util.JSON.decode(request.responseText); 
	    	scratch_value_field.setValue(obj.data);
	    },
	});
	
	this.reload_store = function() {
		Ext.Ajax.request({
		    url: 'controls/actions/scratch_pad.php',
		    method:'POST', 
		    waitTitle:'Connecting', 
		    waitMsg:'Getting data...',
		    params: { type: 'pull' },
		    
		    success:function(request){ 
		    	var obj = Ext.util.JSON.decode(request.responseText); 
		    	scratch_value_field.setValue(obj.data);
		   },
		});
	}
	
	ScratchPadPortlet.superclass.constructor.call(this, {
		frame:true,
        buttonAlign : 'right',
        bodyStyle:'padding:5px 5px 0',
        items: [
            scratch_value_field
        ],

        buttons: [{
            text: 'Save',   
            formBind: true,	 
            handler:function(){ 
                var scratch_value = scratch_value_field.getValue();
            	Ext.Ajax.request({
        		    url: 'controls/actions/scratch_pad.php',
        		    method:'POST', 
        		    waitTitle:'Connecting', 
        		    waitMsg:'Sending data...',
        		    params: { type: 'push', scratch: scratch_value },
        		    
        		    success:function(request){ 
        		    	Ext.Msg.alert('Success', 'Scratch saved');
        		   },
        		});
            },
        }],
        
        keys: [{ 
    		key: [Ext.EventObject.ENTER], handler: function() {
    			Ext.Ajax.request({
        		    url: 'controls/actions/scratch_pad.php',
        		    method:'POST', 
        		    waitTitle:'Connecting', 
        		    waitMsg:'Sending data...',
        		    params: { type: 'push', scratch: scratch_value},
        		    
        		    success:function(request){ 
        		    	Ext.Msg.alert('Success', 'Scratch saved');
        		   },
        		});
    		}
    	}],
        region: "north",
    });
}

Ext.extend(ScratchPadPortlet, Ext.FormPanel);