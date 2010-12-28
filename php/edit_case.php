<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>

<?

 //ini_set("display_errors", 1); 
 //ini_set('log_errors', 1); 
 //error_reporting(E_ALL);

?>

<!-- TemplateBeginEditable name="doctitle" -->
<title>DragonSlayer Edit</title>
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



<body class="twoColLiqLtHdr" onload="init()">
<script type="text/javascript" src="util.js"></script>
<script type="text/javascript" src="wz_tooltip.js"></script>

<?
include 'mysql_conn.php';
$heading = "Update Case: ";
$submit_page = "submit_case.php";

$auto = 0;

if(!is_null($_GET["ip"]))
{
  $ip = $_GET["ip"];
  $q1 = "SELECT tdstamp, event, reporter, dns_name, discovered, INET_NTOA(victim), INET_NTOA(attacker), notes, verification, report_category, network, dhcp_info, netid FROM gwcases where INET_NTOA(victim) = '";
  $q2 = "' ORDER by tdstamp DESC limit 1";
  
  $results = mysql_query($q1 . $ip . $q2);  
  $submit_page = "submit_update.php";

}
elseif(!is_null($_GET["dsid"]))
{
 $dsid = $_GET["dsid"];
 $q1 = "SELECT tdstamp, event, reporter, dns_name, discovered, INET_NTOA(victim), INET_NTOA(attacker), notes, verification, report_category, network, dhcp_info, netid FROM gwcases where id= ";
 $results = mysql_query($q1 . $dsid);
 $submit_page = "submit_update.php";

}
elseif($_GET["auto"] == 1)
{
  echo "AUTO!!!!";
  $auto = 1;
  
  $discovered = htmlspecialchars($_GET["tdstamp"]);
  $event = htmlspecialchars($_GET["event"]);
  $victim = htmlspecialchars($_GET["victim"]);
  $attacker = htmlspecialchars($_GET["attacker"]);
  $notes = htmlspecialchars($_GET["notes"]);

}
else
{
  #die("you must provide an IP or DSID");
  $heading = "Create Case: ";
}


if(!is_null($results))
  {
    $res_array = mysql_fetch_assoc($results);
    foreach( $res_array as $k=> $v)
      {
	$res_array[$k] = htmlentities($v);
      }


    $verification = $res_array["verification"];
    $victim = $res_array["INET_NTOA(victim)"];
    $attacker = $res_array["INET_NTOA(attacker)"];
    $notes = $res_array["notes"];
    $event = $res_array["event"];
    $reporter = $res_array["reporter"];
    $dns_name = $res_array["dns_name"];
    $discovered = $res_array["discovered"];
    $category =  $res_array["report_category"];
    $network = $res_array["network"];
    $dhcp = $res_array["dhcp_info"];
    $netid = $res_array["netid"];
    
  }

?>


<div id="container"> 
  <div id="header">
    <h1>DragonSlayer</h1>
  <!-- end #header --></div>
  <div id="sidebar1">
  <? include('nav.php'); ?>
  <!-- end #sidebar1 --></div>
  <div id="mainContent">
  <h1> <? echo $heading; ?></h1>
    <form id="case_form" name="case_form" method="post" action="<? echo $submit_page; ?>">
      <table width="200" border="1">
        <tr>
          <th scope="col"><label>Dragon Event</label></th>
          <td><input type="text" name="event_id" id="event_id" <? if(!is_null($event)){echo 'value="' . $event . '"';}?> /></td>
        </tr>
        <tr>
         <th> Reporter </th>
         <td><input type="text" name="reporter" id="reporter" <? if(!is_null($reporter)){echo 'value="' . $reporter . '"';} ?>/>      </td>
        </tr>
        <tr>
          <th scope="row"><label>Victim</label></th>
          <td><input type="text" name="victim" id="victim"  onBlur="verify_target(this)"  <? if(!is_null($victim)){echo 'value="' . $victim . '"';} ?>/></td>
        </tr>
        <tr>
          <th scope="row"><label>NetID</label></th>
          <td><input type="text" name="netid" id="netid"  <? if(!is_null($netid)){echo 'value="' . $netid . '"';} ?> /></td>
        </tr>
        <tr>
          <th scope="row"><label>Network</label></th>
          <td><input type="text" name="network" id="network"  <? if(!is_null($network)){echo 'value="' . $network . '"';} ?> /></td>
        </tr>
        <tr>
          <th scope="row"><label>DHCP</label></th>
          <td><input type="text" name="dchp" id="dhcp"  <? if(!is_null($dhcp)){echo 'value="' . $dhcp . '"';} ?> /></td>
        </tr>	  
        <tr>
          <th scope="row"><label>dns</label></th>
          <td><input type="text" name="dns" id="dns" <? if(!is_null($dns_name)){echo 'value="' . $dns_name . '"';} ?> /></td>
        </tr>
        <tr>
          <th scope="row"><label>attacker</label></th>
          <td><input type="text" name="attacker" id="attacker" <? if(!is_null($attacker)){echo 'value="' . $attacker . '"';} ?>/></td>
        </tr>
         <tr>
            <th scope="row"><label>Detection Date</label></th>
            <td><input type="text" name="detection_date" id="detection_date" <? if(!is_null($discovered)){echo 'value="' . $discovered . '"';} ?> /> </td>
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
          <td><textarea name="verification" id="verification" cols="45" rows="5" > <? if(!is_null($verification)){echo $verification;} ?></textarea></td>
        </tr>
        <tr>
          <th scope="row"><label>notes</label></th>
          <td><textarea name="notes" id="notes" cols="45" rows="5"><? if(!is_null($notes)){echo $notes;} ?></textarea></td>
        </tr>
	  <tr> 
          <th scope="row"><label>Category</label></th> 
          <td> 
	      <select name="category" id="category">
  <? if(is_null($category)){$category = 200;} ?>
  <option value="200" <? if($category == 200){echo " selected";}?> > Normal </option>
  <option value="201" <? if($category == 201){echo " selected";}?> > Normal - Remedied</option>
  
  <option value="20" <? if($category == 20){echo " selected";}?> >Student</option>
  <option value="42" <? if($category == 42){echo " selected";}?> >Needs Research</option>
  <option value="100" <? if($category == 100){echo " selected";}?> >Other - Do Not Ticket</option> 
  <option value="300" <? if($category == 300){echo " selected";}?>  >Server </option> 
  <option value="250" <? if($category == 250){echo " selected";}?> >VIP - Please Review</option>
  <option value="251" <? if($category == 251){echo " selected";}?> >VIP - Block/Re-image</option>
  <option value="252" <? if($category == 252){echo " selected";}?> >Please Review - Other</option>
  
  <option value="253" <? if($category == 253){echo " selected";}?> >Request Review</option>
  <option value="500" <? if($category == 500){echo " selected";}?> >Needs Forensic</option>
  <option value="510" <? if($category == 510){echo " selected";}?> >Forensics Ongoing</option>
  <option value="520" <? if($category == 520){echo " selected";}?> >Forensics Complete</option>

 
  <option value="1" <? if($category == 1){echo " selected";}?>  >TEST</option> 
  <option value="0" <? if($category == 0){echo " selected";}?> >Delete</option> 
	      </select> 
	     </td> 
        </tr>
	  
        <tr>
          <td><a href="javascript:clearform(document.case_form);"> clear</a>
          </td>
          <td><label>
            <a href="javascript:submitform(document.case_form);"> submit</a>
          </label></td>
        </tr>
      </table>
      <input type="hidden" name="dsid" value=<? echo "\"" . $dsid . "\"";?>>
    </form>
    <p>&nbsp;</p>

    
	<!-- end #mainContent --></div>
	<!-- This clearing element should immediately follow the #mainContent div in order to force the #container div to contain all child floats --><br class="clearfloat" />
  <div id="footer">
    <p>Insert  footer here</p>
  <!-- end #footer --></div>
<!-- end #container --></div>

<?

if($auto ==1)
  {
    echo "<script>handle_autoload();</script>";
  }
?>
</body>
</html>
