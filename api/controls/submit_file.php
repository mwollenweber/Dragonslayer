<?php 
/** 
 * @author Brandon Dixon
 * @desc Submit user sent file to the parser
 * @return JSON object
 */

/**
 * @name submitFile
 * @params file File sent in by the user for parsing
 * @return JSON object
 */
function submitFile($file) {
	global $link;
	$data = array();
	//check to see if it's a PDF
	if(move_uploaded_file($file["file"]["tmp_name"], "uploads/" . $file["file"]["name"])) {
		$fh = 'uploads/' . $file["file"]["name"];
		$fn = $file["file"]["name"];
		$fs = filesize($fh);
		$fhash = md5_file($fh);
		$date = date('Y-m-d H:i:s');
		
		$query = "SELECT * FROM files WHERE hash = '$fhash'";
		$result = mysqli_query($link,$query);
		$row = mysqli_fetch_assoc($result);
		if($row == null) {
			$query = "INSERT INTO files (filename, filemap, filesize, processed, date, hash) VALUES('$fn','$fh','$fs',0,'$date','$fhash')";
			if(mysqli_query($link,$query)) {
				$data['process_id'] = $fhash;
				$data['status'] = "processing";
			} else {
				$data['status'] = "failed to insert file for processing";
			}
		} else {
			$data['status'] = "file already processed";
		}
		
	} else {
		$data['processing'] = "failure";
	}
	
	return $data;
}
	
?>