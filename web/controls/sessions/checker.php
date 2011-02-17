<?php 
/**
 * @author Brandon Dixon
 * @date 02/17/2011
 * @description Checks if a session variable was set
 * @return JSON object
 */

session_start();
$dsid = (int)$_SESSION['dsid'];
$data = array();
if(is_int($dsid)) {
	$data['success'] = "true";
	$data['dsid'] = $dsid;
	$_SESSION['dsid'] = null;
} else {
	$data['error'] = "Not a valid DSID";
}

echo json_encode($data);

?>