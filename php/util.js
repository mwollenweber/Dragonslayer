var dns_request = null;
var case_request = null;

function trim(stringToTrim) {
  return stringToTrim.replace(/^\s+|\s+$/g,"");
}

function get_ip_info(myobj)
{

  url = "get_ip_info.psp?ip="+myobj.value;
  //alert("url = " + url);

  ip_info_request = new XMLHttpRequest();

  ip_info_request.onreadystatechange = set_ip_info;
  ip_info_request.open("GET", url, true);
  ip_info_request.send(null);

};


function set_ip_info()
{

  if(ip_info_request.readyState != 4)
    {
      return;
    }

 
  if(ip_info_request.readyState == 4)
     {
       if(ip_info_request.status == 200)
	 {
	   var network_name = "";
	   //the problem is prob that the responseXML is broken
	   var ip_info_response = ip_info_request.responseXML;
	   if(ip_info_response == null)
	     {
	       alert("Please enter a victim IP address");
	       //alert("headers= " + ip_info_request.getAllResponseHeaders());
	       //alert("error code= " + ip_info_request.responseXML.parseError.errorCode());
	     }
	   
	   
	   var ip_info = ip_info_response.getElementsByTagName("ip_msg")[0];
	   if(ip_info == null) {alert("fk you ipinfo");}
	   
	   network_name = trim(ip_info.getElementsByTagName("network_name")[0].firstChild.data);
	   fqdn = trim(ip_info.getElementsByTagName("fqdn")[0].firstChild.data);
	   recent_case = trim(ip_info.getElementsByTagName("recent_case")[0].firstChild.data);
	   dhcp_info = trim(ip_info.getElementsByTagName("dhcp_info")[0].firstChild.data);
           crit_info = trim(ip_info.getElementsByTagName("critical_info")[0].firstChild.data);	   

	   tip_msg = "";
	   if(network_name != null)
	     {
	       if(fqdn == "client")
		 {
		   //document.case_form.category.value = 200;
		   document.case_form.dns.value = fqdn;
		   
		 }
	       else if(fqdn.search("gwu.edu") >= 0)
		 {
		   //alert("serveR");
		   //Tip("SERVER: " + fqdn, FIX, ['dns', 170, -20], CLOSEBTN, true);
		   tip_msg += "SERVER: " + fqdn +"\n<br>";
		   //Tip(tip_msg, FIX, ['victim', 170, -20], CLOSEBTN, true, TITLE, "Alert", EXCLUSIVE, true);
		   document.case_form.category.value = 300;
		   document.case_form.dns.value = fqdn;
		   
		 }

	       if(network_name.length > 1)
		 {
		   if(document.case_form.network.value.length <= 0 || document.case_form.network.value.search("unknown") == 0)
		     {
		       document.case_form.network.value = network_name;
		     } 
		 }
	       
		if(crit_info.search("FALSE") < 0)
		 {
			tip_msg += "CRITICAL IP: This host has been identified as critical and should be escalated as a VIP\n<br>";
			//could auto escalate it here
		 }
	       recent_case = parseInt(recent_case);
	       if(recent_case == 1)
		 {
		   tip_msg += "A recent case already exists for this host\n";
		   Tip(tip_msg, FIX, ['victim', 170, -20], STICKY, true, CLOSEBTN, true, TITLE, "Alert", EXCLUSIVE, true);
		 }

	        document.case_form.dhcp.value = dhcp_info;      

		//new mac bs
		//need to iterate
		//mac_addr = ip_info.getElementsByTagName("mac_addr")[0].firstChild.data
		
		mac_addr = ip_info.getElementsByTagName("mac_addr");
		for(i = 0; i < mac_addr.length; i++)
		{	
			tip_msg += "MAC ADDR = " + mac_addr[i].firstChild.data +"\n<br>";
		}
	       if(tip_msg.length > 1)
		 {
		   Tip(tip_msg, FIX, ['victim', 170, -20], CLOSEBTN, true, TITLE, "Alert");
		 }
	     }
	   else
	     {
	       alert("fucking null");
	     }
	 }
     }
  
};


function verify_target(myobj)
{
  //checkdns(myobj);
  //checkipticket(myobj);
  UnTip();
  get_ip_info(myobj);

};


function submitform(frmObj)
{
  setuser_cookie();
  frmObj.submit();
}

function clearform(frmObj)
{
  frmObj.reset();
}

function setuser_cookie()
{
    setCookie("username", document.case_form.reporter.value, 10);
}

function setCookie(c_name, value, expiredays)
{
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = c_name + "=" + escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toUTCString());
}

function getcookie(c_name)
{
    if (document.cookie.length>0)
	{
	    c_start=document.cookie.indexOf(c_name + "=");
	    if (c_start!=-1)
		{
		    c_start=c_start + c_name.length+1;
		    c_end=document.cookie.indexOf(";",c_start);
		    if (c_end==-1) c_end=document.cookie.length;
		    return unescape(document.cookie.substring(c_start,c_end));
		}
	}
    return "";
}

function handle_load()
{
    var username = getcookie("username");
    if(username != null)
	{
	    document.case_form.reporter.value = username;
	}
}

function handle_autoload()
{
   verify_target(document.case_form.victim);
   handle_load();
}
