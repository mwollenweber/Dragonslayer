<?php 
/*
 * @author Brandon Dixon
 * @date 02/14/2011
 * @description Generate Excel report
 * @return Excel document
 * 
 */
header("Content-type: application/vnd.ms-excel");
header("Content-Disposition: attachment; filename=excel.xls");

include '../database/database_connection.php';
if($link === null) { die("Failed database connection"); }

$start_date = $_GET['start_date'];
$end_date = $_GET['end_date'];

$output = '<table border="1">';
if($start_date != null && $end_date != null) {
	$weekly_ips_query = "SELECT INET_NTOA(victim) as victim, network, discovered, notes FROM gwcases WHERE (report_category >= 100) AND DATE(tdstamp) BETWEEN '$start_date' AND '$end_date' GROUP BY victim ORDER BY tdstamp, victim";
	$output .= '<tr><th>Start Date</th><th>End Date</th></tr>';
	$output .= "<tr><td>$start_date</td><td>$end_date</td></tr>";
} else {
	$weekly_ips_query = "SELECT INET_NTOA(victim) as victim, network, discovered, notes FROM gwcases WHERE (report_category >= 100) AND DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), DAYOFWEEK(CURDATE())) and CURDATE() GROUP BY victim ORDER BY tdstamp, victim";
}
	
$result= mysqli_query($link,$weekly_ips_query);
$result_count = mysqli_num_rows($result);

$output .= '<tr><th>Device Name</th><th>IP</th><th>School/Department</th><th>Date/Time</th><th>Patchlink</th><th>Last Patchlink Checkin</th><th>Notes</th></tr>';
for($i=0;$i < $result_count;$i++) {
	$output .= '<tr>';
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

	$output .= "<td>$device_name</td><td>$ip</td><td>$school_department</td><td>$date_time</td><td>$patchlink</td><td>$last_patchlink_checkin</td><td>$notes</td>";
	$output .= '</tr>';
}

$total_cases_query = "SELECT COUNT(*) as count FROM gwcases WHERE DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), DAYOFWEEK(CURDATE())) and CURDATE()  AND report_category > 1";
$student_case_query = "SELECT COUNT(*) as count from gwcases WHERE DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), DAYOFWEEK(CURDATE())) and CURDATE() AND report_category = 20";
$normal_case_query = "SELECT COUNT(*) as count FROM gwcases WHERE DATE(tdstamp) BETWEEN  SUBDATE(CURDATE(), DAYOFWEEK(CURDATE())) and CURDATE() AND report_category >= 100";
$vip_case_query = "SELECT COUNT(*) as count FROM gwcases WHERE DATE(tdstamp) BETWEEN  SUBDATE(CURDATE(), DAYOFWEEK(CURDATE())) and CURDATE() AND report_category > 200";

$result= mysqli_query($link,$total_cases_query);
$total_cases = mysqli_fetch_assoc($result);
$result= mysqli_query($link,$student_case_query);
$student_cases = mysqli_fetch_assoc($result);
$result= mysqli_query($link,$normal_case_query);
$normal_cases = mysqli_fetch_assoc($result);
$result= mysqli_query($link,$vip_case_query);
$vip_cases = mysqli_fetch_assoc($result);

$total_cases = $total_cases['count'];
$student_cases = $student_cases['count'];
$normal_cases = $normal_cases['count'];
$vip_cases = $vip_cases['count'];

$output .= '<tr></tr>';
$output .= '<tr><th>Total Cases</th><th>Student Cases</th><th>Normal Cases</th><th>VIP Cases</th></tr>';
$output .= "<tr><td>$total_cases</td><td>$student_cases</td><td>$normal_cases</td><td>$vip_cases</td></tr>";

$output .= '</table>';

mysqli_close($link);
echo $output;
?>