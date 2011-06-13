<?php 
/** 
 * @author Brandon Dixon
 * @desc Scan functions to get scan data
 * @return JSON object
 */

/**
 * @name getScans
 * @params hash hash of the PDF user wants scans from
 * @return JSON object
 */
function getScans($hash = '', $type) {
	global $collection;
	$data = array();
	
	$criteria = array('hash_data.hashes.file.md5' => "$hash"); 
 
	if($type == "all") {
		$fields = array('scans', "_id" => false);
	} elseif($type == "wepawet") {
		$fields = array('scans.wepawet', "_id" => false);
	} elseif($type == "virustotal") {
		$fields = array('scans.virustotal', "_id" => false);
	} else {
		//handle this
	}

	$cursor = $collection->find($criteria,$fields);
		
	foreach ($cursor as $obj) {
		$data[] = $obj;
	}
	
	$cursor->rewind();

	return $data;
}
	
?>