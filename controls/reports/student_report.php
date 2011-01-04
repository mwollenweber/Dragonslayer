<?php 
include('../database/database_connection.php');

#JSON is expected on the client side
header("Content-type: text/json");

$query = "select discovered, INET_NTOA(victim), event, notes, verification from gwcases where DATE(tdstamp) BETWEEN CURDATE()-DAYOFWEEK(CURDATE()) and CURDATE() and report_category=20";
$result= mysqli_query($link,$query);

$data_result = array();

while($row = mysqli_fetch_assoc($result)) {
	$data_result[] = array($row['discovered'], $row['INET_NTOA(victim)'], $row['event'], $row['notes'], $row['verification']);
}

mysqli_close($link);

echo json_encode($data_result);

?>