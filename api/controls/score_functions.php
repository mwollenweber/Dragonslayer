<?php 
/** 
 * @author Brandon Dixon
 * @desc Score functions to get score data
 * @return JSON object
 */

/**
 * @name getScores
 * @params hash hash of the PDF user wants scores from
 * @return JSON object
 */
function getScores($hash, $type) {
	global $collection;
	$data = array();
	
	$criteria = array('hash_data.hashes.file.md5' => "$hash"); 
 
	if($type == "all") {
		$fields = array('scores', "_id" => false);
	} elseif($type == "total") {
		$fields = array('scores.total', "_id" => false);
	} elseif($type == "primary") {
		$fields = array('scores.primary', "_id" => false);
	} elseif($type == "secondary") {
		$fields = array('scores.secondary', "_id" => false);
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