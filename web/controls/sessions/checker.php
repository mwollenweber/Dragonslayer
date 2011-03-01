<?php 
/**
 * @author Brandon Dixon
 * @date 02/17/2011
 * @description Checks if a session variable was set
 * @return JSON object
 */

session_start();
if($_SESSION['dsid']) {
	$dsid = (int)$_SESSION['dsid'];
	$data = array();
	if(is_int($dsid)) {
		$data['success'] = "true";
		$data['dsid'] = $dsid;
		$_SESSION['dsid'] = null;
	} else {
		$data['error'] = "Not a valid DSID";
	}
}

if($_SESSION['aip']) {
	$aip = $_SESSION['aip'];
	$data['success'] = "true";
	$data['aip'] = $aip;
}

if($_SESSION['vip']) {
	$vip = $_SESSION['vip'];
	$data['success'] = "true";
	$data['vip'] = $vip;
}

echo json_encode($data);

?>