<?

error_reporting(E_ALL);
ini_set("display_errors", 1); 
ini_set("log_errors", 1); 

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
$detection_date = mysql_real_escape_string ($_POST["detection_date"]);
$dsid = mysql_real_escape_string ($_POST["dsid"]);
$category = mysql_real_escape_string ($_POST["category"]);
$dhcp = mysql_real_escape_string ($_POST["dchp"]);
$netid = mysql_real_escape_string ($_POST["netid"]);


if(is_null($dsid))
{
  echo "You must supply a DSID to update a record. <br><br>";
  die();
}

if(strlen($verification) < 4)
  {
    echo "Your verification is insufficient. Please enter more information. <br><br>";
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

//case_insert = "INSERT INTO gwcases (tdstamp, event, victim, network, dns_name, attacker, primary_detection, secondary_detection, verification, notes) VALUES (NOW(), '$event', INET_ATON('$victim'), '$network', '$dns', INET_ATON('$attacker'), '$primary', '$secondary', '$verification', '$notes')";

$case_update = "UPDATE gwcases SET event = '$event', victim = INET_ATON('$victim'), network = '$network', dns_name = '$dns', attacker = INET_ATON('$attacker'), primary_detection = '$primary', secondary_detection = '$secondary', verification = '$verification', notes = '$notes', report_category = '$category', discovered = '$detection_date', dhcp_info = '$dhcp', netid = '$netid' where id = '$dsid'";

$results = mysql_query($case_update)  or die(mysql_error());

mysql_close();

?>


<html>
<head>
</head>
<body>
<title>DragonSlayer Update</title>
<h1> Dragonslayer</h1>
<h3> Update Appears successful.</h3>

<br><br>


</body>


</html>