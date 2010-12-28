<?
//ini_set("display_errors", 1); 
//ini_set('log_errors', 1); 
//error_reporting(E_ALL);

include('mysql_conn.php');

foreach ($_POST as $key => $value) 
{
  #$$key = addslashes(trim($value));
  $_POST[$key] = str_replace("http", "hxxp", $value);
  $_POST[$key] = str_ireplace("script","S C R I P T", $value);
  $_POST[$key] = str_ireplace("embed","E M B E D", $value);
  $_POST[$key] = htmlspecialchars($value);
}

$event = mysql_real_escape_string ($_POST["event_id"]);
$victim = mysql_real_escape_string ($_POST["victim"]);
$network = mysql_real_escape_string ($_POST["network"]);
$dns = mysql_real_escape_string ($_POST["dns"]);
$attacker = mysql_real_escape_string ($_POST["attacker"]);
$primary = mysql_real_escape_string ($_POST["primary_detection"]);
$secondary = mysql_real_escape_string ($_POST["secondary_detection"]);
$verification = mysql_real_escape_string ($_POST["verification"]);
$notes = mysql_real_escape_string ($_POST["notes"]);
$reporter = mysql_real_escape_string ($_POST["reporter"]);
$discovered = mysql_real_escape_string ($_POST["detection_date"]);
$reporter = mysql_real_escape_string($_POST["reporter"]);
$category = mysql_real_escape_string($_POST["category"]);
$dhcp = mysql_real_escape_string($_POST["dhcp"]);
$netid = mysql_real_escape_string($_POST["netid"]);

if(strlen($verification) < 4)
  {
    echo '<html> <body> <div id="left_nav">
<iframe src="nav.php" align="left" frameborder="0" height="800"></iframe> 
</div><div style="float:center;" align="center"><br><br>
<b>Your verification is insufficient. Please enter more information.</b><br><a href="javascript:history.go(-1);">back</a></div> <br><br> </body></html>';
    die();
  }

if(strlen($victim) < 4)
  {
    echo "You must enter a valid victim IP address <br><br>";
    die();
  }

if(strlen($network) < 3){$network = 'GWU';}
if(strlen($dns) < 3){$dns = 'workstation';}
if(strlen($attacker) < 3){$attacker = '0.0.0.0';}

$case_insert = "INSERT INTO gwcases (tdstamp, event, victim, network, dns_name, attacker, primary_detection, secondary_detection, verification, notes, discovered, reporter, report_category, dhcp_info, netid) 
                VALUES 
                (NOW(), '$event', INET_ATON('$victim'), '$network', '$dns', INET_ATON('$attacker'), '$primary', '$secondary', '$verification', '$notes', '$discovered', '$reporter', '$category', '$dhcp', '$netid')";

$results = mysql_query($case_insert)  or die(mysql_error());

mysql_close()


?>


<html>
<head>

</head>
<body>
<title>DragonSlayer Case Submit</title>
<h1> Dragonslayer</h1>
<h3> Submit Appears successful.</h3>
<div id="left_nav">
  <? include('nav.php'); ?>
</div>
<br><br>
<h3>Easy Remedy: </h3>
<? echo $victim; ?> - Compromised Machine <br>
Compromised as of <? echo date("m/d/y",time());?> <br>
Event - Machine is Hacked and backdoored <br>
Remediation - Rebuild System<br>
DHCP - <br>
<?
$cmd = "/usr/local/bin/python ./dhcp_lookup.py";
$ip = "128.164.33.33";

$ip = escapeshellcmd($victim);

echo exec($cmd . " " . $ip);

?>
<br><br>
<a href="javascript:history.go(-1);">back</a>
<br><br><br>

</body>


</html>