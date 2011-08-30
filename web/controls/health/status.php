<?php
/*
 * @author Brandon Dixon
 * @date 08/30/2011
 * @description Calls stored proc. to get status data
 * @return JSON object
 */

include '../database/database_connection.php';

#JSON is expected on the client side
header("Content-type: text/json");

$data = array();

$result = mysqli_query($link, "call check_status()");
while($status_data = mysqli_fetch_assoc($result)) {
	$data = array('dragon_working_count'=>$status_data['dragon_working_count'], 'last_dragon_working_event'=>$status_data['last_dragon_working_event'], 'dragon_count'=>$status_data['dragon_count'], 'last_dragon_event'=>$status_data['last_dragon_event'], 'mdl_count'=>$status_data['mdl_count'], 'last_mdl_update'=>$status_data['last_mdl_update'], 'daily_bad_count'=>$status_data['daily_bad_count'], 'last_daily_bad_event'=>$status_data['last_daily_bad_event']);
}

mysqli_free_result($result); 
mysqli_close($link);

echo json_encode($data);
?>