<?php
/**
 * @author Brandon Dixon
 * @desc 
 * @return JSON object
 */

#JSON is expected on the client side
//header("Content-type: text/json");

//var_dump($_SERVER);

include 'controls/utilities.php';

$data = array();
$process = true;
$methods = array(
	'scores','scores/total','scores/primary','scores/secondary',
	'contents/objects','contents/object','contents/objects/ids',
	'scans','scans/wepawet','scans/virustotal',
	'hashes','hashes/objects','hashes/object','hashes/file','hashes/file/hash/sha1','hashes/file/hash/sha256',
	'structure',
	'full',
	'submit',
	'status',
	);
	
if($_SERVER['REQUEST_METHOD'] == "GET") {
	$hash = $_GET['hash'];
	$data = trim($_GET['handler'], "/");
	$id = $_GET['id'];
} else {
	$hash = $_POST['hash'];
	$data = trim($_POST['handler'], "/");
	$id = $_POST['id'];
}
	
$data = trim($_GET['handler'], "/");
if($hash == null && $data != "submit") {
	$output ['status'] = 'failure';
	$output ['errors'] = 'supply an MD5 hash of the file';
	$process = false;
}

if($process) {
	if(in_array($data, $methods)) {
		if($data == "scores") { //scores 
			$output['result'] = getScores($hash, 'all');
		} elseif($data == "scores/total") { 
			$output['result'] = getScores($hash, 'total');
		} elseif($data == "scores/primary") {
			$output['result'] = getScores($hash, 'primary');
		} elseif($data == "scores/secondary") {
			$output['result'] = getScores($hash, 'secondary');
		} elseif($data == "contents/objects") {	//contents
			$output['result'] = getContents($hash, 'all');
		} elseif($data == "contents/object") {
			$output['result'] = getContents($hash, 'id', $id);
		} elseif($data == "contents/objects/ids") {
			$output['result'] = getContents($hash, 'ids');
		} elseif($data == "scans") { //scans
			$output['result'] = getScans($hash, 'all');
		} elseif($data == "scans/wepawet") {
			$output['result'] = getScans($hash, 'wepawet');
		} elseif($data == "scans/virustotal") {
			$output['result'] = getScans($hash, 'virustotal');
		} elseif($data == "hashes") { //hashes
			$output['result'] = getHashes($hash, 'all');		
		} elseif($data == "hashes/objects") {
			$output['result'] = getHashes($hash, 'objects');			
		} elseif($data == "hashes/object") {
			$output['result'] = getHashes($hash, 'object', $id);			
		} elseif($data == "hashes/file") {
			$output['result'] = getHashes($hash, 'file');		
		} elseif($data == "structure") { //structure
			$output['result'] = getStructure($hash, 'all');				
		} elseif($data == "full") { //full
			$output['result'] = getFull($hash);
		} elseif($data == "submit") {
			$file = $_FILES;
			if($file != null) {
				$output['result'] = submitFile($file);
			} else {
				$output['status'] = 'failure';
			}
		} elseif($data == "status") {
			$output['result'] = getStatus($hash);
		} else {
			$output ['status'] = 'failure';
		}
	} else {
		$output ['status'] = 'failure';
		$output ['errors'] = 'method not implemented';
	}
}

echo json_encode($output);
?>