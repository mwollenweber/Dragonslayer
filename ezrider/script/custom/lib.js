function getXMLHTTPRequest() {
	http_request = false;
	if (window.XMLHttpRequest) { // Mozilla, Safari,...
		http_request = new XMLHttpRequest();
		if (http_request.overrideMimeType) {
			http_request.overrideMimeType('text/html');
	   }
	} 
	else if (window.ActiveXObject) { // IE
		try {
			http_request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				http_request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {}
		}
	}
	if (!http_request) {
		alert('Cannot create XMLHTTP instance');
		return false;
    }
    return http_request;
}
	
function get_form_data(obj, post_file, temp_filler) {
	var getstr = "";
	for (i=0; i<obj.getElementsByTagName("input").length; i++) {
		if (obj.getElementsByTagName("input")[i].type == "text" || obj.getElementsByTagName("input")[i].type == "password") {
			getstr += obj.getElementsByTagName("input")[i].name + "=" + 
	        obj.getElementsByTagName("input")[i].value + "&";
	    }
	}

        for (i=0; i<obj.getElementsByTagName("select").length; i++) {
                getstr += obj.getElementsByTagName("select")[i].name + "=" +
                obj.getElementsByTagName("select")[i].value + "&";
	}

	make_post_request(post_file, getstr, temp_filler);
}

function make_get_request(url, temp_filler) {
	var http_request = getXMLHTTPRequest();
	http_request.open('GET', url, true);
	http_request.onreadystatechange = function() { responseAJAX( http_request, temp_filler );};
	http_request.send(null);
}

function make_chart_get_request(url, parameters, temp_filler) {
	var http_request = getXMLHTTPRequest();
	http_request.open('GET', url, true);
	http_request.setRequestHeader("Content-type", "text/xml");
	http_request.onreadystatechange = function() { parseChart( http_request, temp_filler );};
	http_request.send(parameters);
}

function make_post_request(url, parameters, temp_filler) {
	var http_request = getXMLHTTPRequest();
	http_request.open('POST', url, true);
	http_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http_request.setRequestHeader("Content-length", parameters.length);
	http_request.setRequestHeader("Connection", "close");
	http_request.onreadystatechange = function() { responseAJAX( http_request, temp_filler );};
	http_request.send(parameters);
}

function make_chart_post_request(url, parameters, temp_filler) {
	var http_request = getXMLHTTPRequest();
	http_request.open('POST', url, true);
	http_request.setRequestHeader("Content-type", "text/xml");
	http_request.setRequestHeader("Content-length", parameters.length);
	http_request.setRequestHeader("Connection", "close");
	http_request.onreadystatechange = function() { parseChart( http_request, temp_filler );};
	http_request.send(parameters);
}

function insert_form( form_information, temp_filler, processing_message )
{
	var http_request = getXMLHTTPRequest();
	document.getElementById( temp_filler ).innerHTML = processing_message;
	http_request.open( "GET", form_information);
	http_request.onreadystatechange = function() { responseAJAX( http_request, temp_filler );};
	http_request.send( null );
}

function toggle_hide(obj) 
{
	var el = document.getElementById(obj);
	if ( el.style.display != 'none' ) {
		el.style.display = 'none';
	}
	else {
		el.style.display = '';
	}
}

function parseChart( request, temp_filler )
{
	if ( request.readyState == 4 ) {
		if ( request.status == 200 ) {
			var response = request.responseText;
			var myChart = new JSChart(temp_filler, 'bar');
			myChart.setDataXML('data.xml');
			document.getElementById(temp_filler).innerHTML = myChart.draw();;
		} else {
			alert( "error: " + request.statusText );
		}	
	}
}


function responseAJAX( request, temp_filler )
{
 if ( request.readyState == 4 )
 {
  if ( request.status == 200 )
  {
   document.getElementById( temp_filler ).innerHTML = request.responseText;
  }
  else
  {
   alert( "error: " + request.statusText );
  }
 }
}