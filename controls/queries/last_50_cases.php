<?php 
include('../database/database_connection.php');

#JSON is expected on the client side
header("Content-type: text/json");

$query = "SELECT id, tdstamp, reporter, event, INET_NTOA(victim), INET_NTOA(attacker), dns_name, network, verification, notes, report_category FROM gwcases ORDER BY tdstamp DESC LIMIT 50";
$result= mysqli_query($link,$query);

$data_result = array();

while($row = mysqli_fetch_assoc($result)) {
	$category = $row['report_category'];
	if($category == 0) {
		$category = "Delete";
	} elseif ($category == 20) {
		$category = "Student";
	} elseif ($category == 200) {
		$category = "Normal";
	} elseif ($category == 42) {
		$category = "Needs Research";
	} elseif ($category == 100) {
		$category = "Other - Do Not Ticket";
	}
	
	$data_result[] = array($row['id'],$row['tdstamp'], $row['reporter'], $row['event'], $row['INET_NTOA(victim)'], $row['INET_NTOA(attacker)'], $row['dns_name'], $row['network'], $row['verification'], $row['notes'], $category);
}

mysqli_close($link);

echo json_encode($data_result);

?>