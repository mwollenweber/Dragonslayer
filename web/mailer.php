<?php
/*
 * @author Brandon Dixon
 * @date 01/19/2011
 * @description Sends mail notification to user on critical compromise
 * @return JSON object
 */

include('controls/database/database_connection.php');

//Drop the view, then recreate it, then query
$drop_bad_view = "DROP VIEW IF EXISTS badv";
$create_bad_view = "CREATE view badv AS select tdstamp, event, victim, attacker, description from hourly_dragon_bad GROUP BY victim, event, attacker ORDER BY victim, event, tdstamp";
$query = "select tdstamp, event, INET_NTOA(victim), INET_NTOA(attacker), description from badv as bad where not EXISTS (select 1 from gwcases where bad.victim = gwcases.victim and DATE(gwcases.tdstamp) BETWEEN SUBDATE(CURDATE(), 7) AND CURDATE())";

mysqli_query($link,$drop_bad_view);
mysqli_query($link,$create_bad_view);
$result= mysqli_query($link,$query);

$data_result = array();
$victims = array();
while($row = mysqli_fetch_assoc($result)) {
	$victims[] = $row['INET_NTOA(victim)'];	
}

$to      = '4434156856@txt.att.net';
$headers = 'From: <ds2@gwu.edu>';

foreach($victims as &$value) {
	$query = "SELECT INET_NTOA(ip), notes FROM critical where ip = INET_ATON('$value')";
	$result= mysqli_query($link,$query);
	$row = mysqli_fetch_assoc($result);
	if($row != null) {
		$query = "SELECT name from netblocks where INET_ATON('$value') BETWEEN start and end limit 1";
		$result= mysqli_query($link,$query);
		$row = mysqli_fetch_assoc($result);
		$network = $row['name'];
		echo $network;
//		mail($to, $network, $value, $headers);
	}
}

mysqli_close($link);
?>
