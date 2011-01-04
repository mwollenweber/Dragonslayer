<?php 
include('../database/database_connection.php');

#JSON is expected on the client side
header("Content-type: text/json");

$query = "select tdstamp, event, INET_NTOA(victim), INET_NTOA(attacker), description from hourly_dragon_mdl GROUP BY victim,attacker ORDER BY victim";
$result= mysqli_query($link,$query);

$data_result = array();

while($row = mysqli_fetch_assoc($result)) {
	$data_result[] = array($row['tdstamp'], $row['event'], $row['INET_NTOA(victim)'], $row['INET_NTOA(attacker)'], $row['description']);
}

mysqli_close($link);

echo json_encode($data_result);

?>