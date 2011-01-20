<?php
/*
 * @author Brandon Dixon
 * @date 01/19/2011
 * @description Get events from the past 30 days to display to the user
 * @return JSON object
 * 
 * TODO identify the best way to return data to the user for graphing
 */

include '../database/database_connection.php';

$q = addslashes($_GET['q']);

#JSON is expected on the client side
header("Content-type: text/json");

$data = array();

if($q == "series") {
	//select the events first to define our series
	$query = "select distinct(event) as event from gwcases where DATE(tdstamp) between subdate(curdate(),30) and curdate() GROUP BY event order by count(event) desc limit 10";
	$result= mysqli_query($link,$query);
	while($row = mysqli_fetch_assoc($result)) {
		$event = $row['event'];	
		$event_x = $event . "_date";
		$event_y = $event . "_count";
//		$event_x = "date";
//		$event_y = "count";
		$data_url = 'controls/reports/past_30_day_events.php?q=' . $event;
		$data[] = array('name'=>$event, 'dataIndex'=>$event_y, 'xField'=>$event_x, 'yField'=>$event_y, 'dataURL'=>$data_url); //series { name: , dataIndex: , xField: , yField, dataURL }
	}
} else {
	$query= "select DATE(tdstamp) as d, count(event) as c from gwcases where event='$q' and DATE(tdstamp) between subdate(curdate(),30) and curdate() GROUP BY DATE(tdstamp), event order by DATE(tdstamp) DESC, c desc";
	$result= mysqli_query($link,$query);
	while($event_data = mysqli_fetch_assoc($result)) {
		$data[] = array($event_data['d'], (int)$event_data['c']);
	}
}

mysqli_close($link);

echo json_encode($data);
?>