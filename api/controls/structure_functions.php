<?php 
/** 
 * @author Brandon Dixon
 * @desc Structure functions to get structure data
 * @return JSON object
 */

/**
 * @name getStructure
 * @params hash hash of the PDF user wants structure from
 * @return JSON object
 */
function getStructure($hash = '', $type) {
	global $collection;
	$data = array();
	
	$criteria = array('hash_data.hashes.file.md5' => "$hash"); 
 
	if($type == "all") {
		$fields = array('structure', "_id" => false);
	} else {
		
	}

	$cursor = $collection->find($criteria,$fields);
		
	foreach ($cursor as $obj) {
		$data[] = $obj;
	}
	
	$cursor->rewind();

	return $data;
}
	
?>