<?php 
/*
 * @author Brandon Dixon
 * @date 02/14/2011
 * @description Generate Excel report
 * @return Excel document
 * 
 */
header("Content-type: application/vnd.ms-excel");
header("Content-Disposition: attachment; filename=generated_report.xls");

include '../database/database_connection.php';
if($link === null) { die("Failed database connection"); }

$start_date = $_GET['start_date'];
$end_date = $_GET['end_date'];

$output = '<table border="1">';
if($start_date != null && $end_date != null) {
	$weekly_ips_query = "SELECT INET_NTOA(victim) as victim, network, discovered, notes FROM gwcases WHERE (report_category >= 100) AND (report_category != 205) AND DATE(tdstamp) BETWEEN '$start_date' AND '$end_date' GROUP BY victim ORDER BY tdstamp, victim";
	$output .= '<tr><th><b>Start Date</b></th><th><b>End Date</b></th></tr>';
	$output .= "<tr><td>$start_date</td><td>$end_date</td></tr>";
} else {
	$weekly_ips_query = "SELECT INET_NTOA(victim) as victim, network, discovered, notes FROM gwcases WHERE (report_category >= 100) AND (report_category != 205) AND DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), DAYOFWEEK(CURDATE())) and CURDATE() GROUP BY victim ORDER BY tdstamp, victim";
}
	
$result= mysqli_query($link,$weekly_ips_query);
$result_count = mysqli_num_rows($result);

$output .= '<tr><th><b>Device Name</b></th><th><b>IP</b></th><th><b>School/Department</b></th><th><b>Date/Time</b></th><th><b>Patchlink</b></th><th><b>Last Patchlink Checkin</b></th><th><b>Notes</b></th></tr>';
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

if($start_date != null && $end_date != null) {
	$total_cases_query = "SELECT COUNT(*) as count FROM gwcases WHERE DATE(tdstamp) BETWEEN '$start_date' AND '$end_date' AND report_category > 1 AND (report_category != 205 AND report_category != 25)";
	$student_case_query = "SELECT COUNT(*) as count from gwcases WHERE DATE(tdstamp) BETWEEN '$start_date' AND '$end_date' AND report_category = 20";
	$normal_case_query = "SELECT COUNT(*) as count FROM gwcases WHERE DATE(tdstamp) BETWEEN '$start_date' AND '$end_date' AND report_category >= 100 AND (report_category != 205 AND report_category != 25)";
	$vip_case_query = "SELECT COUNT(*) as count FROM gwcases WHERE DATE(tdstamp) BETWEEN '$start_date' AND '$end_date' AND report_category > 200 AND (report_category != 205 AND report_category != 25)";
	$mail_compromise_query = "SELECT COUNT(*) as count FROM gwcases WHERE DATE(tdstamp) BETWEEN '$start_date' AND '$end_date' AND (report_category = 205 OR report_category = 25)";
} else {
	$total_cases_query = "SELECT COUNT(*) as count FROM gwcases WHERE DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), DAYOFWEEK(CURDATE())) and CURDATE()  AND report_category > 1 AND (report_category != 205 AND report_category != 25)";
	$student_case_query = "SELECT COUNT(*) as count from gwcases WHERE DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), DAYOFWEEK(CURDATE())) and CURDATE() AND report_category = 20 AND (report_category != 205 AND report_category != 25)";
	$normal_case_query = "SELECT COUNT(*) as count FROM gwcases WHERE DATE(tdstamp) BETWEEN  SUBDATE(CURDATE(), DAYOFWEEK(CURDATE())) and CURDATE() AND report_category >= 100 AND (report_category != 205 AND report_category != 25)";
	$vip_case_query = "SELECT COUNT(*) as count FROM gwcases WHERE DATE(tdstamp) BETWEEN  SUBDATE(CURDATE(), DAYOFWEEK(CURDATE())) and CURDATE() AND report_category > 200";
	$mail_compromise_query = "SELECT COUNT(*) as count FROM gwcases WHERE DATE(tdstamp) BETWEEN  SUBDATE(CURDATE(), DAYOFWEEK(CURDATE())) and CURDATE() AND (report_category = 205 OR report_category = 25)";
}
	
$result= mysqli_query($link,$total_cases_query);
$total_cases = mysqli_fetch_assoc($result);
$result= mysqli_query($link,$student_case_query);
$student_cases = mysqli_fetch_assoc($result);
$result= mysqli_query($link,$normal_case_query);
$normal_cases = mysqli_fetch_assoc($result);
$result= mysqli_query($link,$vip_case_query);
$vip_cases = mysqli_fetch_assoc($result);
$result= mysqli_query($link,$mail_compromise_query);
$mail_cases = mysqli_fetch_assoc($result);

$total_cases = $total_cases['count'];
$student_cases = $student_cases['count'];
$normal_cases = $normal_cases['count'];
$vip_cases = $vip_cases['count'];
$mail_cases = $mail_cases['count'];

$output .= '<tr></tr>';
$output .= '<tr><th><b>Total Cases</b></th><th><b>Student Cases</b></th><th><b>Normal Cases</b></th><th><b>VIP Cases</b></th><th><b>Mail Compromises</b></th></tr>';
$output .= "<tr><td>$total_cases</td><td>$student_cases</td><td>$normal_cases</td><td>$vip_cases</td><td>$mail_cases</td></tr>";

$output .= '</table>';

mysqli_close($link);
echo $output;
?>