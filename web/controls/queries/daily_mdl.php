<?php 
/*
 * @author Brandon Dixon
 * @date 01/19/2011
 * @description Queries for MDL related attacks for a given day
 * @return JSON object
 */

include('../database/database_connection.php');

#JSON is expected on the client side
header("Content-type: text/json");

$query = "select tdstamp, event, INET_NTOA(victim), INET_NTOA(attacker), description from hourly_dragon_mdl GROUP BY victim,attacker ORDER BY victim";
$result= mysqli_query($link,$query);

$data_result = array();

while($row = mysqli_fetch_assoc($result)) {
	$url = "<a href='#' name='openCreateCase'>+</a>"; //Provide the user with something to click on for case creation
	$data_result[] = array('case'=>$url, 'date'=>$row['tdstamp'], 'event'=>$row['event'], 'victim'=>$row['INET_NTOA(victim)'], 'attacker'=>$row['INET_NTOA(attacker)'], 'notes'=>$row['description']);
}

mysqli_close($link);

echo json_encode($data_result);

?>