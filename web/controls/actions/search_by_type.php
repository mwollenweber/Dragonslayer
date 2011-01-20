<?php 
/*
 * @author Brandon Dixon
 * @date 01/19/2011
 * @description Allows user to search by a number of things and get matching cases
 * @return JSON object
 */

include('../database/database_connection.php');

#JSON is expected on the client side
header("Content-type: text/json");

$type = addslashes($_POST['type']);
$search_value = addslashes($_POST['search_value']);

if($type == "DSID") {
	$query = "SELECT id, tdstamp, reporter, event, INET_NTOA(victim), INET_NTOA(attacker), dns_name, network, verification FROM gwcases WHERE id='$search_value' ORDER BY id DESC LIMIT 100";
} elseif ($type == "Analyst") {
	$query = "SELECT id, tdstamp, reporter, event, INET_NTOA(victim), INET_NTOA(attacker), dns_name, network, verification FROM gwcases WHERE reporter='$search_value' ORDER BY id DESC LIMIT 100";
} elseif ($type == "Event") {
	$query = "SELECT id, tdstamp, reporter, event, INET_NTOA(victim), INET_NTOA(attacker), dns_name, network, verification FROM gwcases WHERE event='$search_value' ORDER BY id DESC LIMIT 100";
} elseif ($type == "Victim IP") {
	$query = "SELECT id, tdstamp, reporter, event, INET_NTOA(victim), INET_NTOA(attacker), dns_name, network, verification FROM gwcases WHERE INET_NTOA(victim)='$search_value' ORDER BY id DESC LIMIT 100";
} elseif ($type == "Attacker IP") {
	$query = "SELECT id, tdstamp, reporter, event, INET_NTOA(victim), INET_NTOA(attacker), dns_name, network, verification FROM gwcases WHERE INET_NTOA(attacker)='$search_value' ORDER BY id DESC LIMIT 100";
} elseif ($type == "Network") {
	$query = "SELECT id, tdstamp, reporter, event, INET_NTOA(victim), INET_NTOA(attacker), dns_name, network, verification FROM gwcases WHERE network='$search_value' ORDER BY id DESC LIMIT 100";
} else {
	//TODO handle this
}

$data_result = array();
$result= mysqli_query($link,$query);

while($row = mysqli_fetch_assoc($result)) {
	$data_result[] = array($row['id'], $row['tdstamp'], $row['reporter'], $row['event'], $row['INET_NTOA(victim)'], $row['INET_NTOA(attacker)'], $row['dns_name'], $row['network'], $row['verification']);
}

mysqli_close($link);

echo json_encode($data_result);

?>