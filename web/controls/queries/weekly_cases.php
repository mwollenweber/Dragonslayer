<?php 
/*
 * @author Brandon Dixon
 * @date 01/19/2011
 * @description Gets all the cases entered for the week
 * @return JSON object
 */

include('../database/database_connection.php');

#JSON is expected on the client side
header("Content-type: text/json");

$query = "SELECT id, tdstamp, reporter, event, INET_NTOA(victim), INET_NTOA(attacker), dns_name, network, verification, notes, report_category FROM gwcases WHERE DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), DAYOFWEEK(CURDATE())) and CURDATE() AND report_category > 0 ORDER BY tdstamp DESC";
$result= mysqli_query($link,$query);

$data_result = array();

while($row = mysqli_fetch_assoc($result)) {
	//need to display the right category based on the number
	$category = $row['report_category'];
	if($category == 200) {
		$category = "Normal";
	} elseif ($category == 201) {
		$category = "Normal - Remedied";
	} elseif ($category == 20) {
		$category = "Student";
	} elseif ($category == 300) {
		$category = "Server";
	} elseif ($category == 42) {
		$category = "Needs Research";
	} elseif ($category == 100) {
		$category = "Other - Do Not Ticket";
	} elseif ($category == 252) {
		$category = "Other - Please Review";
	} elseif ($category == 250) {
		$category = "VIP - Please Review";
	} elseif ($category == 251) {
		$category = "VIP - Block/Re-image";
	} elseif ($category == 253) {
		$category = "Request Review";
	} elseif ($category == 500) {
		$category = "Needs Forensics";
	} elseif ($category == 510) {
		$category = "Forensics Ongoing";
	} elseif ($category == 520) {
		$category = "Forensics Complete";
	} elseif ($category == 0) {
		$category = "Delete";
	} else {
		
	}
	
	$data_result[] = array($row['id'],$row['tdstamp'], $row['reporter'], $row['event'], $row['INET_NTOA(victim)'], $row['INET_NTOA(attacker)'], $row['dns_name'], $row['network'], $row['verification'], $row['notes'], $category);
}

mysqli_close($link);

echo json_encode($data_result);

?>