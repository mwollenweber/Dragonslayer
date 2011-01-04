<?php 
include('../database/database_connection.php');

#JSON is expected on the client side
header("Content-type: text/json");

$patchy_query = "SELECT dev_name, tdstamp FROM patchy WHERE INET_NTOA(ip) = '";
$network_query_start = "SELECT name FROM netblocks where INET_ATON('";
$network_query_end = "') BETWEEN start and end ORDER BY tdstamp DESC limit 1";
$weekly_ips_query = "SELECT INET_NTOA(victim), network, discovered, notes FROM gwcases WHERE (report_category >= 100) AND DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), DAYOFWEEK(CURDATE())) and CURDATE() GROUP BY victim ORDER BY tdstamp, victim";
$result= mysqli_query($link,$query);

$data_result = array();

while($row = mysqli_fetch_assoc($result)) {
	$data_result[] = array($row['tdstamp'], $row['event'], $row['INET_NTOA(victim)'], $row['INET_NTOA(attacker)'], $row['description']);
}

mysqli_close($link);

echo json_encode($data_result);

?>