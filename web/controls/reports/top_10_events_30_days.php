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

$query= "select distinct(event) as event, count(event) as count from gwcases where DATE(tdstamp) between subdate(curdate(),30) and curdate() AND (report_category > 42 OR report_category = 20) AND (report_category != 205 AND report_category != 25) GROUP BY event order by count(event) desc limit 10";
$result= mysqli_query($link,$query);
while($event_data = mysqli_fetch_assoc($result)) {
	$data[] = array($event_data['event'], (int)$event_data['count']);
}

mysqli_close($link);

echo json_encode($data);
?>