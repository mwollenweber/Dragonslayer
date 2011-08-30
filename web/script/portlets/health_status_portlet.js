function HealthStatusPortlet(){
	
	this.reload_data = function() {
		Ext.Ajax.request({
	        url: 'controls/health/status.php',
	        method:'GET', 
	        waitTitle:'Connecting', 
	        waitMsg:'Getting data...',
	        
	        success:function(request){ 
	        	var obj = Ext.util.JSON.decode(request.responseText); 
	        	content = "<b>Dragon Working Count: </b>" + obj.dragon_working_count + "<br>";
	        	content += "<b>Dragon Event Count: </b>" + obj.dragon_count + "<br>";
	        	content += "<b>MDL Count: </b>" + obj.mdl_count + "<br>";
	        	content += "<b>Daily Bad Count: </b>" + obj.daily_bad_count;
	        	
	        	content += "<br><br>";
	        	red = "<img src='images/flag_red.gif'/>";
	        	yellow = "<img src='images/flag_orange.gif'/>";
	        	green = "<img src='images/flag_green.gif'/>";
	        	one_hour = 60 * 60;
	        	two_hour = 60 * 60 * 2;
	        	
	        	if(obj.delta_dragon_working > two_hour) {
	        		dragon_working_img = red;
	        	} else if(obj.delta_dragon_working > one_hour) {
	        		dragon_working_img = yellow;
	        	} else {
	        		dragon_working_img = green;
	        	}
	        	
	        	if(obj.delta_dragon > two_hour) {
	        		dragon_event_img = red;
	        	} else if(obj.delta_dragon > one_hour) {
	        		dragon_event_img = yellow;
	        	} else {
	        		dragon_event_img = green;
	        	}
	        	
	        	if(obj.delta_mdl > two_hour) {
	        		mdl_img = red;
	        	} else if(obj.delta_mdl > one_hour) {
	        		mdl_img = yellow;
	        	} else {
	        		mdl_img = green;
	        	}
	        	
	        	if(obj.delta_bad_update > two_hour) {
	        		daily_bad_img = red;
	        	} else if(obj.delta_bad_update > one_hour) {
	        		daily_bad_img = yellow;
	        	} else {
	        		daily_bad_img = green;
	        	}
	        	
	        	content += "<b>Last Dragon Working Event: </b>" + obj.last_dragon_working_event +  " " + dragon_working_img + "<br>" ;
	        	content += "<b>Last Dragon Event: </b>" + obj.last_dragon_event + " " + dragon_event_img + "<br>";
	        	content += "<b>Last MDL Update: </b>" + obj.last_mdl_update + " " + mdl_img + "<br>";
	        	content += "<b>Last Daily Bad Update: </b>" + obj.last_daily_bad_event + " " + daily_bad_img + "<br>";
	        	Ext.getDom('health_panel_data').innerHTML = content;
		    	time = new Date();
		    	Ext.getCmp('health_status_portlet_bottom_bar').setText("Last updated: " + time); 
	       },
		});
	}
	
    health_status_tbar = new Ext.Toolbar.TextItem({
        text: '',
        id: 'health_status_portlet_bottom_bar',
	})
	
	this.reload_data();
	
	healthData = "Waiting for health status...";
	
	overallHealthPanel = new Ext.Panel({
        frame:true,
        id:'health_panel_data',
        html: healthData,
	})
	
	HealthStatusPortlet.superclass.constructor.call(this, {
        frame:true,
        closable:true,
        titleCollapse:true,
        items: [overallHealthPanel],
        bbar: [health_status_tbar]
    });
}

Ext.extend(HealthStatusPortlet, Ext.FormPanel);