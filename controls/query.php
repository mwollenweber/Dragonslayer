<?php
include 'database/database_connection.php';
//$type = $_POST["type"];
$type = $_GET["type"];

#JSON is expected on the client side
header("Content-type: text/json");

if ($type == 'week' || $type == 'month' || $type == 'year') {
	#Reporter Query
	$reporters = array();
	$query= "SELECT distinct(reporter) from gwcases";
	if ($type == 'week') {
		$query = $query . " WHERE YEARWEEK(tdstamp) = YEARWEEK(CURRENT_TIMESTAMP) AND reporter <> \"\"";
	} elseif ($type == 'month'){
		$query = $query . " WHERE YEAR(tdstamp) = YEAR(CURRENT_TIMESTAMP) AND MONTH(tdstamp) = MONTH(CURRENT_TIMESTAMP) AND reporter <> \"\"";
	} elseif ($type == 'year') {
		$query = $query . " WHERE YEAR(tdstamp) = YEAR(CURRENT_TIMESTAMP) AND reporter <> \"\"";
	} else {}
	
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
		$query= "SELECT reporter, HOUR(tdstamp) as rtime, COUNT(reporter) as count from gwcases";
		
		#Adjust query based on param
		if ($type == 'week') {
			$query = $query . " WHERE YEARWEEK(tdstamp) = YEARWEEK(CURRENT_TIMESTAMP) AND reporter = '$reporter' AND reporter <> \"\" GROUP BY HOUR(tdstamp), reporter ORDER BY reporter, rtime DESC, count DESC";
		} elseif ($type == 'month') {
			$query = $query . " WHERE YEAR(tdstamp) = YEAR(CURRENT_TIMESTAMP) AND MONTH(tdstamp) = MONTH(CURRENT_TIMESTAMP) AND reporter = '$reporter' AND reporter <> \"\" GROUP BY HOUR(tdstamp), reporter ORDER BY reporter, rtime DESC, count DESC";
		} elseif ($type == 'year') {
			$query = $query . " WHERE YEAR(tdstamp) = YEAR(CURRENT_TIMESTAMP) AND reporter = '$reporter' AND reporter <> \"\" GROUP BY HOUR(tdstamp), reporter ORDER BY reporter, rtime DESC, count DESC";
		} else {}
		
		#Make the query
		$results= mysqli_query($link,$query);
		
		while($row = mysqli_fetch_assoc($results)) {
			$point = array((int)$row['rtime'],(int)$row['count']);
			$instance[] = $point;
		}
		$instance[] = array(24,0);
		$data[] = $instance;	
	}
} elseif ($type == 'cases') {
	
	$instance = array();
	$whole = array();
	
	#All cases
	$query = "SELECT COUNT(id) as c, week(tdstamp) as w from gwcases where DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), 365) AND CURDATE() group by week(tdstamp) ORDER BY id, week(tdstamp)";
	$result= mysqli_query($link,$query);
	while($row = mysqli_fetch_assoc($result)) {
		$point = array('week_all'=>(int)$row['w'],'count_all'=>(int)$row['c']);
		$instance[] = $point;
	}
	
	$whole['data'] = $instance;

	#Student cases
	$query = "select count(id) as c, week(tdstamp) as w from gwcases where DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), 365) AND CURDATE() AND report_category = 20 group by week(tdstamp) ORDER BY id, week(tdstamp)";
	$result= mysqli_query($link,$query);
	while($row = mysqli_fetch_assoc($result)) {
		$point = array('week_student'=>(int)$row['w'],'count_student'=>(int)$row['c']);
		$instance[] = $point;
	}

	$whole['data'] = $instance;
	
	#DIT cases
	$query = "select count(id) as c, week(tdstamp) as w from gwcases where DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), 365) AND CURDATE() AND network like '%DIT%'  and  network not like '%guest%' GROUP BY week(tdstamp) ORDER BY id, week(tdstamp)";
	$result= mysqli_query($link,$query);
	while($row = mysqli_fetch_assoc($result)) {
		$point = array('week_dit'=>(int)$row['w'],'count_dit'=>(int)$row['c']);
		$instance[] = $point;
	}
	
	$whole['data'] = $instance;
	
} else {}

mysqli_close($link);

echo json_encode($whole);

?>