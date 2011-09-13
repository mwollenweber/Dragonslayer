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

$query = "SELECT DISTINCT(YEAR(tdstamp)) as year FROM gwcases WHERE (report_category > 42 OR report_category = 20) AND (report_category != 205 AND report_category != 25)";
$result= mysqli_query($link,$query);
while($years = mysqli_fetch_assoc($result)) {
	$temp = null;
	$iyear = $years["year"];
	$data[$iyear] = array("1"=>0,"2"=>0,"3"=>0,"4"=>0,"5"=>0,"6"=>0,"7"=>0,"8"=>0,"9"=>0,"10"=>0,"11"=>0,"12"=>0);
	$query = "SELECT MONTH(tdstamp) as month, COUNT(*) as count FROM gwcases WHERE YEAR(tdstamp) = '$iyear' AND (report_category > 42 OR report_category = 20) AND (report_category != 205 AND report_category != 25) GROUP BY YEAR(tdstamp), MONTH(tdstamp) DESC";
	$inner_result = mysqli_query($link,$query);
	while($event_data = mysqli_fetch_assoc($inner_result)) {
		$data[$iyear][$event_data['month']] = (int)$event_data['count'];
	}
	
	for($i=1;$i<=sizeof($data[$iyear]);$i++) {
		$temp[] = $data[$iyear][$i];
	}
	
	$data[$iyear] = $temp;
}

mysqli_close($link);

echo json_encode($data);
?>