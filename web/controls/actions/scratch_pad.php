<?php 
/*
 * @author Brandon Dixon
 * @date 01/31/2011
 * @description Save/pull scratch pad data
 * @return JSON object
 * @notes this could be done in a more elegant fashion using a pubsub method instead of polling
 */

include('../database/database_connection.php');

#JSON is expected on the client side
header("Content-type: text/json");

$data_result = array();

$type = addslashes($_POST['type']);
$scratch_value = addslashes($_POST['scratch']);

//only two approved options, fail silently if something unexpected is passed in
if($type == "push") {
	$query = "DELETE FROM scratch_pad"; //clear the table
	mysqli_query($link,$query);
	$query = "INSERT INTO scratch_pad (scratch) VALUES('$scratch_value')";
	$result= mysqli_query($link,$query);
	$data_result['success'] = 'true';
} elseif($type == "pull") {
	$query = "SELECT scratch FROM scratch_pad";
	$result= mysqli_query($link,$query);
	$row = mysqli_fetch_assoc($result);
	$data_result['data'] = $row['scratch'];
} else {
	
}

mysqli_close($link);

echo json_encode($data_result);

?>