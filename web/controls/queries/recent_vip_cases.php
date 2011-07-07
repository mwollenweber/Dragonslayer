<?php 
/*
 * @author Brandon Dixon
 * @date 01/19/2011
 * @description Gets a list of recent VIP compromises
 * @return JSON object
 */

include('../database/database_connection.php');

#JSON is expected on the client side
header("Content-type: text/json");

$query = "SELECT id, tdstamp, reporter, event, INET_NTOA(victim), INET_NTOA(attacker), dns_name, network, verification, notes, report_category FROM gwcases WHERE report_category = 250 OR report_category = 251 ORDER BY tdstamp DESC LIMIT 50";
$result= mysqli_query($link,$query);

$data_result = array();

while($row = mysqli_fetch_assoc($result)) {
	$data_result[] = array($row['id'],$row['tdstamp'], $row['reporter'], $row['event'], $row['INET_NTOA(victim)'], $row['INET_NTOA(attacker)'],$row['network'],$row['notes']);
}

mysqli_close($link);

echo json_encode($data_result);

?>