<?php
include 'database/database_connection.php';
$type = $_GET["type"];

#JSON is expected on the client side
header("Content-type: text/json");

if ($type == 'mon') {
	$week = 0;
} elseif ($type == 'tue'){
	$week = 1;
} elseif ($type == 'wed') {
	$week = 2;
} elseif ($type == 'thu') {
	$week = 3;
} elseif ($type == 'fri') {
	$week = 4;
} elseif ($type == 'sat') {
	$week = 5;
} elseif ($type == 'sun') {
	$week = 6;
} else {
}


#Reporter Query
$reporters = array();
$query= "SELECT distinct(reporter) from gwcases WHERE YEAR(tdstamp) = YEAR(CURRENT_TIMESTAMP) AND reporter <> \"\" AND MONTH(tdstamp) = MONTH(CURRENT_TIMESTAMP) AND YEARWEEK(tdstamp) = YEARWEEK(CURRENT_TIMESTAMP) AND WEEKDAY(tdstamp) = $week";

#Make the query
$result= mysqli_query($link,$query);
while($row = mysqli_fetch_assoc($result)) {
	$reporters[] = $row['reporter'];
}
	
$data = array();

foreach ($reporters as $reporter) {

	$instance = array();
	
	#Base Query
	$query= "SELECT reporter, COUNT(reporter) as count from gwcases WHERE YEAR(tdstamp) = YEAR(CURRENT_TIMESTAMP) AND reporter = '$reporter' AND reporter <> \"\" AND MONTH(tdstamp) = MONTH(CURRENT_TIMESTAMP) AND YEARWEEK(tdstamp) = YEARWEEK(CURRENT_TIMESTAMP) AND WEEKDAY(tdstamp) = $week GROUP BY HOUR(tdstamp), reporter ORDER BY reporter, count DESC";
	
	#Make the query
	$results= mysqli_query($link,$query);
	
	while($row = mysqli_fetch_assoc($results)) {
		$point = array($row['reporter'],(int)$row['count']);
		$data[] = $point;
	}
	//$data[] = $instance;	
}

mysqli_close($link);

echo json_encode($data);
?>