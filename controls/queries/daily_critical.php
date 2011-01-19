<?php 
/*
 * @author Brandon Dixon
 * @date 01/19/2011
 * @description Queries for events deemed critical and returns them
 * @return JSON object
 * 
 * TODO paginate the results or control how much comes back at a given time 
 */

include('../database/database_connection.php');

#JSON is expected on the client side
header("Content-type: text/json");

$query = "select tdstamp, event, INET_NTOA(dstip), INET_NTOA(srcip) from dragon where (dragon.dstip = ANY (SELECT ip from critical) AND dragon.srcip NOT BETWEEN 2158231552 AND 2158297087 AND dragon.srcip NOT BETWEEN 2717712384 AND 2717777919 AND DATE(tdstamp) BETWEEN CURDATE()-1 and CURDATE()) GROUP BY srcip, dstip, event ORDER BY DATE(tdstamp), dstip, srcip";
$result= mysqli_query($link,$query);

$data_result = array();

while($row = mysqli_fetch_assoc($result)) {
	$data_result[] = array($row['tdstamp'], $row['event'], $row['INET_NTOA(dstip)'], $row['INET_NTOA(srcip)']);
}

mysqli_close($link);

echo json_encode($data_result);

?>