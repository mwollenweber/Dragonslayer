<?php 
/*
 * @author Brandon Dixon
 * @date 01/25/2011
 * @description Submits the patchy data from the uploaded file
 * @return JSON object
 */

include('../database/database_connection.php');

sleep(1);
move_uploaded_file($_FILES["patchy_file"]["tmp_name"], "../uploads/" . $_FILES["patchy_file"]["name"]); //just a backup
$file = '../uploads/' . $_FILES["patchy_file"]["name"];

$data = array();

if (($handle = fopen($file, "r")) !== FALSE) {
	while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
		$device = strtolower(trim($data[0]));
		$ip = strtolower(trim($data[1]));
		$update = strtolower(trim($data[6]));
		
		$device = str_replace('"', '', $device);
		$device = str_replace("\\", "\\\\", $device);
		$ip = str_replace('"', '', $ip);
		$update = str_replace('"', '', $update);
		
		$query = "INSERT INTO patchy(ip, dev_name, tdstamp) VALUES (INET_ATON('$ip'), '$device', '$update') ON DUPLICATE KEY UPDATE tdstamp=VALUES(tdstamp)";
		
		if(mysqli_query($link,$query)) {
		} else {
		}
	}
	fclose($handle);
}    

mysqli_close($link);

echo '{success:true, file:'.json_encode($_FILES['patchy_file']["name"]).'}';
    
?>