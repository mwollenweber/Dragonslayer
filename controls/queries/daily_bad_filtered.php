<?php 
include('../database/database_connection.php');

#JSON is expected on the client side
header("Content-type: text/json");

$drop_bad_view = "DROP VIEW IF EXISTS badv";
$create_bad_view = "CREATE view badv AS select tdstamp, event, victim, attacker, description from hourly_dragon_bad GROUP BY victim, event, attacker ORDER BY victim, event, tdstamp";
$query = "select tdstamp, event, INET_NTOA(victim), INET_NTOA(attacker), description from badv as bad where not EXISTS (select 1 from gwcases where bad.victim = gwcases.victim and DATE(gwcases.tdstamp) BETWEEN SUBDATE(CURDATE(), 7) AND CURDATE())";

mysqli_query($link,$drop_bad_view);
mysqli_query($link,$create_bad_view);
$result= mysqli_query($link,$query);

$data_result = array();
$count = 0;
while($row = mysqli_fetch_assoc($result)) {
	$url = "<a href='#' name='openCreateCase'>+</a>";
	$data_result[] = array('case'=>$url, 'date'=>$row['tdstamp'], 'event'=>$row['event'], 'victim'=>$row['INET_NTOA(victim)'], 'attacker'=>$row['INET_NTOA(attacker)'], 'notes'=>$row['description']);
	$count++;
}

mysqli_close($link);

echo json_encode($data_result);

?>