<?php 
/** 
 * @author Brandon Dixon
 * @desc Content functions to get content data
 * @return JSON object
 */

/**
 * @name getContents
 * @params hash hash of the PDF user wants contents from
 * @return JSON object
 */
function getContents($hash = '', $type, $id = null) {
	global $collection;
	$data = array();
	
	$criteria = array('hash_data.hashes.file.md5' => "$hash"); 
	
	if($id != null) {
		$criteria = array('hash_data.hashes.file.md5' => "$hash", 'contents.objects.object.id' => (int)$id);
	}
 
	if($type == "all") {
		$fields = array('contents', "_id" => false);
	} elseif($type == "id" && $id != null) {
		$fields = array('contents.objects.object', "_id" => false);
	} elseif($type == "ids") {
		$fields = array('contents.objects.object.id', "_id" => false);
	} else {
		//handle this
	}

	$cursor = $collection->find($criteria,$fields);
		
	foreach ($cursor as $obj) {
		if($type == "all" || $type == "ids") {
			$data[] = $obj;
		} elseif($type == "id") {
			for($i=0;$i < count($obj['contents']['objects']['object']); $i++) {
				if($obj['contents']['objects']['object'][$i]['id'] == (int)$id) {
					$data[] = $obj['contents']['objects']['object'][$i];
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