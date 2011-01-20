<?php 
/*
 * @author Brandon Dixon
 * @date 01/19/2011
 * @description Updates a case from the user filled out form
 * @return JSON object
 */

include('../database/database_connection.php');

#JSON is expected on the client side
header("Content-type: text/json");

$data = array();
$proceed = true;

//clean the input to some degree to avoid displaying bad stuff
foreach ($_POST as $key => $value) {
	$_POST[$key] = str_replace("http", "hxxp", $value);
	$_POST[$key] = str_ireplace("script","S C R I P T", $value);
	$_POST[$key] = str_ireplace("embed","E M B E D", $value);
	$_POST[$key] = htmlspecialchars($value);
}

//clean the POST variables
$dsid = addslashes($_POST["dsid"]);
$event = addslashes($_POST["event"]);
$victim = addslashes($_POST["victim"]);
$network = addslashes($_POST["network"]);
$dns = addslashes($_POST["dns"]);
$attacker = addslashes($_POST["attacker"]);
$primary = addslashes($_POST["primary_detection"]);
$secondary = addslashes($_POST["secondary_detection"]);
$verification = addslashes($_POST["verification"]);
$notes = addslashes($_POST["notes"]);
$reporter = addslashes($_POST["reporter"]);
$detection_date = addslashes($_POST["detection_date"]);
$detection_time = addslashes($_POST["detection_time"]); //need to add this into the mix
$reporter = addslashes($_POST["reporter"]);
$category = addslashes($_POST["category"]);
$dhcp = addslashes($_POST["dhcp"]);
$netid = addslashes($_POST["netid"]);

//sanity checks
if(strlen($verification) < 4) {
	$data['success'] = "false";
	$data['error'] = "Please enter more verification";
	$proceed = false;
}

if(strlen($victim) < 4) {
	$data['success'] = "false";
	$data['error'] = "You must enter a valid victim IP address";
	$proceed = false;
}

if(strlen($network) < 3) {
	$network = "GWU";
}

if(strlen($dns) < 3) {
	$dns = "workstation";
}

if(strlen($attacker) < 3) {
	$attacker = "0.0.0.0";
}

if($category == "Normal") {
	$category = 200;
} elseif ($category == "Normal - Remedied") {
	$category = 201;
} elseif ($category == "Student") {
	$category = 20;
} elseif ($category == "Server") {
	$category = 300;
} elseif ($category == "Needs Research") {
	$category = 42;
} elseif ($category == "Other - Do Not Ticket") {
	$category = 100;
} elseif ($category == "Other - Please Review") {
	$category = 252;
} elseif ($category == "VIP - Please Review") {
	$category = 250;
} elseif ($category == "VIP - Block/Re-image") {
	$category = 251;
} elseif ($category == "Request Review") {
	$category = 253;
} elseif ($category == "Needs Forensics") {
	$category = 500;
} elseif ($category == "Forensics Ongoing") {
	$category = 510;
} elseif ($category == "Forensics Complete") {
	$category = 520;
} elseif ($category == "Delete") {
	$category = 0;
}

if($proceed) {
	$query = "UPDATE gwcases SET event = '$event', network = '$network', dns_name = '$dns', attacker = INET_ATON('$attacker'), primary_detection = '$primary', secondary_detection = '$secondary', verification = '$verification', notes = '$notes', discovered = '$discovered', reporter = '$reporter', report_category = '$category', dhcp_info = '$dhcp', netid = '$netid' WHERE id=$dsid"; 

	if(mysqli_query($link,$query)) {
		$data['success'] = "true";
	} else {
		$data['success'] = "false";
		$data['error'] = "Something went wrong when submitting";
	}
}

mysqli_close($link);

echo json_encode($data);

?>