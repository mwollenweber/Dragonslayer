<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>


<!-- TemplateBeginEditable name="doctitle" -->
<title>DragonSlayer Case Submit</title>
<!-- TemplateEndEditable -->
<!-- TemplateBeginEditable name="head" -->
<!-- TemplateEndEditable -->
<style type="text/css"> 
<!-- 
body  {
	font: 100% Verdana, Arial, Helvetica, sans-serif;
	background: #666666;
	margin: 0; /* it's good practice to zero the margin and padding of the body element to account for differing browser defaults */
	padding: 0;
	text-align: center; /* this centers the container in IE 5* browsers. The text is then set to the left aligned default in the #container selector */
	color: #000000;
}
.twoColLiqLtHdr #container { 
	width: 80%;  /* this will create a container 80% of the browser width */
	background: #FFFFFF;
	margin: 0 auto; /* the auto margins (in conjunction with a width) center the page */
	border: 1px solid #000000;
	text-align: left; /* this overrides the text-align: center on the body element. */
} 
.twoColLiqLtHdr #header { 
	background: #DDDDDD; 
	padding: 0 10px;  /* this padding matches the left alignment of the elements in the divs that appear beneath it. If an image is used in the #header instead of text, you may want to remove the padding. */
} 
.twoColLiqLtHdr #header h1 {
	margin: 0; /* zeroing the margin of the last element in the #header div will avoid margin collapse - an unexplainable space between divs. If the div has a border around it, this is not necessary as that also avoids the margin collapse */
	padding: 10px 0; /* using padding instead of margin will allow you to keep the element away from the edges of the div */
}

/* Tips for sidebar1:
1. since we are working in percentages, it's best not to use padding on the sidebar. It will be added to the width for standards compliant browsers creating an unknown actual width. 
2. Space between the side of the div and the elements within it can be created by placing a left and right margin on those elements as seen in the ".twoColLiqLtHdr #sidebar1 p" rule.
3. Since Explorer calculates widths after the parent element is rendered, you may occasionally run into unexplained bugs with percentage-based columns. If you need more predictable results, you may choose to change to pixel sized columns.
*/
.twoColLiqLtHdr #sidebar1 {
	float: left; 
	width: 24%; /* since this element is floated, a width must be given */
	background: #EBEBEB; /* the background color will be displayed for the length of the content in the column, but no further */
	padding: 15px 0; /* top and bottom padding create visual space within this div  */
}
.twoColLiqLtHdr #sidebar1 h3, .twoColLiqLtHdr #sidebar1 p {
	margin-left: 10px; /* the left and right margin should be given to every element that will be placed in the side columns */
	margin-right: 10px;
}

/* Tips for mainContent:
1. the space between the mainContent and sidebar1 is created with the left margin on the mainContent div.  No matter how much content the sidebar1 div contains, the column space will remain. You can remove this left margin if you want the #mainContent div's text to fill the #sidebar1 space when the content in #sidebar1 ends.
2. to avoid float drop at a supported minimum 800 x 600 resolution, elements within the mainContent div should be 430px or smaller (this includes images).
3. in the Internet Explorer Conditional Comment below, the zoom property is used to give the mainContent "hasLayout." This avoids several IE-specific bugs.
*/
.twoColLiqLtHdr #mainContent { 
	margin: 0 20px 0 26%; /* the right margin can be given in percentages or pixels. It creates the space down the right side of the page. */
} 
.twoColLiqLtHdr #footer { 
	padding: 0 10px; /* this padding matches the left alignment of the elements in the divs that appear above it. */
	background:#DDDDDD;
} 
.twoColLiqLtHdr #footer p {
	margin: 0; /* zeroing the margins of the first element in the footer will avoid the possibility of margin collapse - a space between divs */
	padding: 10px 0; /* padding on this element will create space, just as the the margin would have, without the margin collapse issue */
}

/* Miscellaneous classes for reuse */
.fltrt { /* this class can be used to float an element right in your page. The floated element must precede the element it should be next to on the page. */
	float: right;
	margin-left: 8px;
}
.fltlft { /* this class can be used to float an element left in your page */
	float: left;
	margin-right: 8px;
}
.clearfloat { /* this class should be placed on a div or break element and should be the final element before the close of a container that should fully contain a float */
	clear:both;
    height:0;
    font-size: 1px;
    line-height: 0px;
}
--> 
</style><!--[if IE]>
<style type="text/css"> 
/* place css fixes for all versions of IE in this conditional comment */
.twoColLiqLtHdr #sidebar1 { padding-top: 30px; }
.twoColLiqLtHdr #mainContent { zoom: 1; padding-top: 15px; }
/* the above proprietary zoom property gives IE the hasLayout it needs to avoid several bugs */
</style>
<![endif]--></head>

<script>
var dns_request = null;
var case_request = null;

function verify_targets(myobj)
{

  //clear tooltips
  UnTip();

  var target_list = new String(myobj.value);
  var target_array = new Array() ;
  target_array = target_list.split("\n");
  
  for( i = 0 ; i < target_array.length; i++)
    {

      checkdns(target_array[i]);
      checkipticket(target_array[i]);
    }
  
}

function checkdns(str)
{

  url = "check_dns.psp?ip="+str;

  dns_request = new XMLHttpRequest();

  dns_request.onreadystatechange = alertContents;
  dns_request.open("GET", url, true);
  dns_request.send(null);

}

function checkipticket(str)
{

  url = "quick_lookup.php?ip="+str;

  case_request = new XMLHttpRequest();

  case_request.onreadystatechange = alertIP;
  case_request.open("GET", url, true);
  case_request.send(null);


}



function alertIP()
{
   if(case_request.readyState != 4)
     {
       return;
     }
   if(case_request.status == 200)
    {
 
      //alert(case_request.responseText);
      if(case_request.responseText.indexOf("1") > 0)
	{
	  alert("A ticket for this ip exists this week. Please confirm it's not a duplicate");
	  //document.dns.value = http_request.responseText;
	}
    }
};



function alertContents()
{

  //can't pass in a variable but we can get the info from the server
  str = "blrhk";

   if(dns_request.readyState != 4)
     {
       return;
     }
   if(dns_request.status == 200)
    {
 
      //need to change the server response to include both the ip and the hostname
      //alert(dns_request.responseText);
      if(dns_request.responseText.indexOf("gwu.edu") > 0)
	{
	  Tip("A provided IP appears to be a server: ip = " +str +" hostname= " +dns_request.responseText);
	  //document.dns.value = dns_request.responseText;
	}
    }
};

function submitform(frmObj)
{
  frmObj.submit();
}

function clearform(frmObj)
{
  frmObj.reset();
 
}


</script>

<body class="twoColLiqLtHdr">

<script type="text/javascript" src="wz_tooltip.js"></script>



<div id="container"> 
  <div id="header">
    <h1>DragonSlayer</h1>
  <!-- end #header --></div>
  <div id="sidebar1">
    <h3>Navigation</h3>
    <p><a href="weekly_cases.php">Weekly Cases</a></p>
    <p><a href="weekly_report.php">Weekly Report</a></p>
    <p><a href="daily_mdl.php">Daily MDL</a></p>
    <p>Search Tickets</p>
    <p>Daily SANS 10000</p>
    <p>Heavy Hitters</p>
  <!-- end #sidebar1 --></div>
  <div id="mainContent">
    <h1> Enter your Batch of Events:</h1>
    <form id="case_form" name="case_form" method="post" action="submit_batch.php">
      <table width="200" border="1">
  
        <tr>
          <th scope="row"><label>Victims</label></th>
          <td><textarea  name="victims" id="victims" cols="20" rows="20" onBlur="verify_targets(this)"></textarea></td>
        </tr>
        <tr>
          <th scope="col"><label>Dragon Event</label></th>
          <td><input type="text" name="event_id" id="event_id" /></td>
        </tr>
        <tr>
         <th> Reporter </th>
         <td><input type="text" name="reporter" id="reporter" />      </td>
        </tr>
        <tr>
          <th scope="row"><label>Network</label></th>
          <td><input type="text" name="network" id="network" /></td>
        </tr>
        <tr>
          <th scope="row"><label>dns</label></th>
          <td><input type="text" name="dns" id="dns" /></td>
        </tr>
        <tr>
          <th scope="row"><label>attacker</label></th>
          <td><input type="text" name="attacker" id="attacker" /></td>
        </tr>
         <tr>
            <th scope="row"><label>Detection Date</label></th>
            <td><input type="text" name="detection_date" id="detection_date" /> <small><i>ex: 2010-01-01 09:00:00</i></small></td>
         </tr>
        <tr>
          <th scope="row"><label>primary_detection</label></th>
          <td><input type="text" name="primary_detection" id="primary_detection" /></td>
        </tr>
        <tr>
          <th scope="row"><label>secondary_detection</label></th>
          <td><input type="text" name="secondary_detection" id="secondary_detection" /></td>
        </tr>
        <tr>
          <th scope="row"><label>verification</label></th>
          <td><textarea name="verification" id="verification" cols="45" rows="5"></textarea></td>
        </tr>
        <tr>
          <th scope="row"><label>notes</label></th>
          <td><textarea name="notes" id="notes" cols="45" rows="5"></textarea></td>
        </tr>
        <tr>
          <td><a href="javascript:clearform(document.case_form);"> clear</a>
          </td>
          <td><label>
            <a href="javascript:submitform(document.case_form);"> submit</a>
          </label></td>
        </tr>
      </table>
    </form>
    <p>&nbsp;</p>

    
	<!-- end #mainContent --></div>
	<!-- This clearing element should immediately follow the #mainContent div in order to force the #container div to contain all child floats --><br class="clearfloat" />
  <div id="footer">
    <p>Insert  footer here</p>
  <!-- end #footer --></div>
<!-- end #container --></div>
</body>
</html>
