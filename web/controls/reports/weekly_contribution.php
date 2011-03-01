<?php
/*
 * @author Brandon Dixon
 * @date 01/19/2011
 * @description Get the amount of cases entered from each user for the week
 * @return JSON object
 */

include '../database/database_connection.php';

#JSON is expected on the client side
header("Content-type: text/json");

#Reporter Query
$reporters = array();
$query= "SELECT distinct(reporter) from gwcases WHERE YEAR(tdstamp) = YEAR(CURRENT_TIMESTAMP) AND reporter <> \"\" AND MONTH(tdstamp) = MONTH(CURRENT_TIMESTAMP) AND YEARWEEK(tdstamp) = YEARWEEK(CURRENT_TIMESTAMP)";

#Make the query
$result= mysqli_query($link,$query);
while($row = mysqli_fetch_assoc($result)) {
	$reporters[] = $row['reporter'];
}
	
$data = array();

//for each person, grab their contribution
foreach ($reporters as $reporter) {

	#Base Query
	$query= "SELECT distinct(reporter), COUNT(reporter) as count from gwcases WHERE report_category > 19 AND YEAR(tdstamp) = YEAR(CURRENT_TIMESTAMP) AND reporter = '$reporter' AND reporter <> \"\" AND DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), 60) AND CURDATE() AND YEARWEEK(tdstamp) = YEARWEEK(CURRENT_TIMESTAMP) GROUP BY reporter ORDER BY reporter, count DESC";
	
	#Make the query
	$results= mysqli_query($link,$query);
	
	while($row = mysqli_fetch_assoc($results)) {
		$point = array($row['reporter'],(int)$row['count']);
		$data[] = $point;
	}

}

mysqli_close($link);

echo json_encode($data);
?>