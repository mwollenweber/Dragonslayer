<?php 
/** 
 * @author Brandon Dixon
 * @desc Hash functions to get hash data
 * @return JSON object
 */

/**
 * @name getHashes
 * @params hash hash of the PDF user wants contents from
 * @return JSON object
 */
function getHashes($hash = '', $type, $id = null) {
	global $collection;
	$data = array();
	
	$criteria = array('hash_data.hashes.file.md5' => "$hash"); 
	
	if($id != null) {
		$criteria = array('hash_data.hashes.file.md5' => "$hash", 'hash_data.hashes.objects.object.id' => (int)$id);
	}
 
	if($type == "all") {
		$fields = array('hash_data', "_id" => false);
	} elseif($type == "objects") {
		$fields = array('hash_data.hashes.objects.object', "_id" => false);
	} elseif($type == "object") {
		$fields = array('hash_data.hashes.objects.object', "_id" => false);
	} elseif($type == "file") {
		$fields = array('hash_data.hashes.file', "_id" => false);
	} else {
		//handle this
	}

	$cursor = $collection->find($criteria,$fields);
		
	foreach ($cursor as $obj) {
		if($type == "all" || $type == "objects" || $type == "file") {
			$data[] = $obj;
		} elseif($type == "object") {
			for($i=0;$i < count($obj['hash_data']['hashes']['objects']['object']); $i++) {
				if($obj['hash_data']['hashes']['objects']['object'][$i]['id'] == (int)$id) {
					$data[] = $obj['hash_data']['hashes']['objects']['object'][$i];
				}
			}
		} else {
			//handle this
		}
	}
	
	$cursor->rewind();

	return $data;
}
	
?>