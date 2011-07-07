<?php 
/*
 * @author Brandon Dixon
 * @date 01/19/2011
 * @description Edits an already entered case
 * @return JSON object
 */

include('../database/database_connection.php');

#JSON is expected on the client side
header("Content-type: text/json");

$ip_address = addslashes($_POST['ip_address']);

$query = "SELECT id, discovered, reporter, event, INET_NTOA(victim), INET_NTOA(attacker), dns_name, network, verification FROM gwcases WHERE INET_NTOA(victim)='$ip_address' ORDER BY tdstamp";

$data_result = array();
$result= mysqli_query($link,$query);

while($row = mysqli_fetch_assoc($result)) {
	$data_result[] = array($row['id'], $row['discovered'], $row['reporter'], $row['event'], $row['INET_NTOA(victim)'], $row['INET_NTOA(attacker)'], $row['dns_name'], $row['network'], $row['verification']);
}

mysqli_close($link);

echo json_encode($data_result);

?>