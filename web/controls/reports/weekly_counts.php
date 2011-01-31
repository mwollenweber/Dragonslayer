<?php
/*
 * @author Brandon Dixon
 * @date 01/25/2011
 * @description Get counts for the weekly cases
 * @return JSON object
 */

include '../database/database_connection.php';

#JSON is expected on the client side
header("Content-type: text/json");

$data = array();

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

$data[] = array('type'=>'Total Cases','count'=>(int)$total_cases['count']);
$data[] = array('type'=>'Student Cases','count'=>(int)$student_cases['count']);
$data[] = array('type'=>'Normal Cases','count'=>(int)$normal_cases['count']);
$data[] = array('type'=>'VIP Cases','count'=>(int)$vip_cases['count']);

mysqli_close($link);

echo json_encode($data);
?>