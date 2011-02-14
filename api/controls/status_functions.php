<?php 
/** 
 * @author Brandon Dixon
 * @desc Status functions to get structure data
 * @return JSON object
 */

/**
 * @name getStatus
 * @params hash hash of the PDF user wants structure from
 * @return JSON object
 */
function getStatus($hash) {
	global $link;
	$query = "SELECT processed FROM files WHERE hash = '$hash'";
	$result = mysqli_query($link,$query);
	$row = mysqli_fetch_assoc($result);

	if($row['processed'] == null) {
		$data['status'] = "no file with that process ID";
	} elseif ($row['processed'] == 0 ) {
		$data['status'] = "still processing";
	} else {
		global $collection;
		$data = array();
	
		$criteria = array('hash_data.hashes.file.md5' => "$hash"); 
		$fields = array("_id"=>false);
	
		$cursor = $collection->find($criteria,$fields);
			
		foreach ($cursor as $obj) {
			$data[] = $obj;
		}
		
		$cursor->rewind();
	}

	return $data;
}
	
?>