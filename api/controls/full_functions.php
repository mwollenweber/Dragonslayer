<?php 
/** 
 * @author Brandon Dixon
 * @desc Full functions to get full data
 * @return JSON object
 */

/**
 * @name getFull
 * @params hash hash of the PDF user wants full object from
 * @return JSON object
 */
function getFull($hash = '') {
	global $collection;
	$data = array();

	$criteria = array('hash_data.hashes.file.md5' => "$hash"); 
	$fields = array("_id"=>false);

	$cursor = $collection->find($criteria,$fields);
		
	foreach ($cursor as $obj) {
		$data[] = $obj;
	}
	
	$cursor->rewind();

	return $data;
}
	
?>