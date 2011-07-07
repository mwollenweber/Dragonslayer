<?php 
/*
 * @author Brandon Dixon
 * @date 01/19/2011
 * @description Allows user to search by a number of things and get matching cases
 * @return JSON object
 */

include('../database/database_connection.php');

#JSON is expected on the client side
header("Content-type: text/json");

$type = addslashes($_POST['search_type']);
$search_value = addslashes($_POST['search_value']);
$start = ($_REQUEST["start"] == null)? 0 : $_REQUEST["start"];
$count = ($_REQUEST["limit"] == null)? 50 : $_REQUEST["limit"];

//inline checks for IP address related searching


if($type == "dsid") {
	$query = "SELECT id, tdstamp, reporter, event, INET_NTOA(victim), INET_NTOA(attacker), dns_name, network, verification FROM gwcases WHERE id='$search_value' ORDER BY id DESC";
} elseif ($type == "analyst") {
	$query = "SELECT id, tdstamp, reporter, event, INET_NTOA(victim), INET_NTOA(attacker), dns_name, network, verification FROM gwcases WHERE reporter='$search_value' ORDER BY id DESC";
} elseif ($type == "netid") {
	$query = "SELECT id, tdstamp, reporter, event, INET_NTOA(victim), INET_NTOA(attacker), dns_name, network, verification FROM gwcases WHERE netid='$search_value' ORDER BY id DESC";
} elseif ($type == "event") {
	$query = "SELECT id, tdstamp, reporter, event, INET_NTOA(victim), INET_NTOA(attacker), dns_name, network, verification FROM gwcases WHERE event='$search_value' ORDER BY id DESC";
} elseif ($type == "victim_ip") {
	$pos = strpos($search_value,"/");
	if($pos === false) {
		$ip_address = $search_value;
		$ip_mask = "32";
	}
	else {
		$ip_data = explode("/",$search_value);
		$ip_address = $ip_data[0];
		$ip_mask = $ip_data[1];
	}
	
	$adjusted_mask = pow(2,(32 - int($ip_mask))); //grabs the amount of host addresses based on the subnet mask
	
//	$query = "SELECT id, tdstamp, reporter, event, INET_NTOA(victim), INET_NTOA(attacker), dns_name, network, verification FROM gwcases WHERE INET_NTOA(victim)='$search_value' ORDER BY id DESC";
	$query = "SELECT id, tdstamp, reporter, event, INET_NTOA(victim), INET_NTOA(attacker), dns_name, network, verification FROM gwcases WHERE victim BETWEEN (INET_ATON($search_value) AND INET_ATON($search_value) + $adjusted_mask) ORDER BY id DESC";
} elseif ($type == "attacker_ip") {
	$query = "SELECT id, tdstamp, reporter, event, INET_NTOA(victim), INET_NTOA(attacker), dns_name, network, verification FROM gwcases WHERE INET_NTOA(attacker)='$search_value' ORDER BY id DESC";
} elseif ($type == "network") {
	$query = "SELECT id, tdstamp, reporter, event, INET_NTOA(victim), INET_NTOA(attacker), dns_name, network, verification FROM gwcases WHERE network='$search_value' ORDER BY id DESC";
} elseif ($type == "text_in_verification") {
	$query = "SELECT id, tdstamp, reporter, event, INET_NTOA(victim), INET_NTOA(attacker), dns_name, network, verification FROM gwcases WHERE verification regexp '[[:<:]]" . $search_value . "[[:>:]]' ORDER BY id DESC";
} else {
	//TODO handle this
}

$result= mysqli_query($link,$query);
$row_cnt = mysqli_num_rows($result);

$query.= " LIMIT $start,$count";

$data_result = array();
$result= mysqli_query($link,$query);
$data_result['total'] = $row_cnt;

while($row = mysqli_fetch_assoc($result)) {
	$holder[] = array('dsid'=>$row['id'], 'date'=>$row['tdstamp'],'analyst'=>$row['reporter'],'event'=>$row['event'],'victim'=>$row['INET_NTOA(victim)'],'attacker'=>$row['INET_NTOA(attacker)'],'dns'=>$row['dns_name'],'network'=>$row['network'],'confirmation'=>$row['verification']);
}

if($row_cnt <= 0) {
	$data_result['results'] = null;
}

$data_result['results'] = $holder;

mysqli_close($link);

echo json_encode($data_result);

?>