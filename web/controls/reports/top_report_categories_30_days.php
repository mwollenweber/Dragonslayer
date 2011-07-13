<?php
/*
 * @author Brandon Dixon
 * @date 07/13/2011
 * @description Get top 10 events from the past 30 days to display to the user
 * @return JSON object
 */

include '../database/database_connection.php';

#JSON is expected on the client side
header("Content-type: text/json");

$data = array();

$query= "select distinct(report_category) as event, count(report_category) as count from gwcases where DATE(tdstamp) between subdate(curdate(),30) and curdate() AND (report_category > 42 OR report_category = 20) AND (report_category != 205 AND report_category != 25) GROUP BY event order by count(report_category);";
$result= mysqli_query($link,$query);
while($event_data = mysqli_fetch_assoc($result)) {
	$category = $event_data['event'];
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
	} elseif ($category == 25) {
		$category = "Mail Compromise - Student";
	} elseif ($category == 205) {
		$category = "Mail Compromise - Faculty/Staff";
	} else {
		
	}
	$data[] = array($category, (int)$event_data['count']);
}

mysqli_close($link);

echo json_encode($data);
?>