<?php
include 'database/database_connection.php';
$type = $_GET["type"];

#JSON is expected on the client side
header("Content-type: text/json");

if ($type == 'jan') {
	$month = 1;
} elseif ($type == 'feb'){
	$month = 2;
} elseif ($type == 'mar') {
	$month = 3;
} elseif ($type == 'apr') {
	$month = 4;
} elseif ($type == 'may') {
	$month = 5;
} elseif ($type == 'jun') {
	$month = 6;
} elseif ($type == 'jul') {
	$month = 7;
} elseif ($type == 'aug') {
	$month = 8;
} elseif ($type == 'sep') {
	$month = 9;
} elseif ($type == 'oct') {
	$month = 10;
} elseif ($type == 'nov') {
	$month = 11;
} elseif ($type == 'dec') {
	$month = 12;
} else {
}


#Reporter Query
$reporters = array();
$query= "SELECT distinct(reporter) from gwcases WHERE YEAR(tdstamp) = YEAR(CURRENT_TIMESTAMP) AND reporter <> \"\" AND MONTH(tdstamp) = $month";

#Make the query
$result= mysqli_query($link,$query);
while($row = mysqli_fetch_assoc($result)) {
	$reporters[] = $row['reporter'];
}
	
$data = array();
$data[] = $reporters;

foreach ($reporters as $reporter) {

	$instance = array();
	
	#Base Query
	$query= "SELECT reporter, HOUR(tdstamp) as rtime, COUNT(reporter) as count from gwcases WHERE YEAR(tdstamp) = YEAR(CURRENT_TIMESTAMP) AND reporter = '$reporter' AND reporter <> \"\" AND MONTH(tdstamp) = $month GROUP BY HOUR(tdstamp), reporter ORDER BY reporter, rtime DESC, count DESC";
	
	#Make the query
	$results= mysqli_query($link,$query);
	
	while($row = mysqli_fetch_assoc($results)) {
		$point = array((int)$row['rtime'],(int)$row['count']);
		$instance[] = $point;
	}
	$instance[] = array(24,0);
	$data[] = $instance;	
}

mysqli_close($link);

echo json_encode($data);
?>