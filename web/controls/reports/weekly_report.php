<?php 
/*
 * @author Brandon Dixon
 * @date 01/19/2011
 * @description Gets the cases entered this week
 * @return JSON object
 */

include('../database/database_connection.php');

#JSON is expected on the client side
header("Content-type: text/json");

$weekly_ips_query = "SELECT INET_NTOA(victim) as victim, network, tdstamp as discovered, notes FROM gwcases WHERE (report_category >= 100) AND DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), DAYOFWEEK(CURDATE())) and CURDATE() GROUP BY victim ORDER BY tdstamp, victim";

$result= mysqli_query($link,$weekly_ips_query);
$result_count = mysqli_num_rows($result);

$data_result = array();

for($i=0;$i < $result_count;$i++) {
	$result_array = mysqli_fetch_assoc($result);
	$ip = $result_array['victim']; //IP
	$school_department = $result_array['network']; //School/Department
	$date_time = $result_array['discovered']; //Date and Time of Compromise
	$notes = $result_array['notes'];
	
	//Call out to get Patchlink data
	$patchy_query = "SELECT dev_name, tdstamp FROM patchy WHERE INET_NTOA(ip) = '$ip' ORDER by id DESC limit 1";
	$patchy_results = mysqli_query($link,$patchy_query);
	
	if(mysqli_num_rows($patchy_results) == 1) {
		$patchy_results_array = mysqli_fetch_assoc($patchy_results);
		$device_name = $patchy_results_array['dev_name'];
		$patchlink = "YES";
		$last_patchlink_checkin = $patchy_results_array['tdstamp'];
	} else {
		$device_name = "";
		$patchlink = "NO";
		$last_patchlink_checkin = "";
	}
	
	//Last checks
	if($device_name == null) { $device_name = ""; }
	if($last_patchlink_checkin == null) { $last_patchlink_checkin == ""; }
	
	$data_result[] = array($device_name,$ip,$school_department,$date_time,$patchlink,$last_patchlink_checkin,$notes);
}

mysqli_close($link);

echo json_encode($data_result);

?>