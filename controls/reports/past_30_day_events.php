<?php
include '../database/database_connection.php';

#JSON is expected on the client side
header("Content-type: text/json");

$query= "select event, DATE(tdstamp), count(event) as c from gwcases where DATE(tdstamp) between subdate(curdate(),30) and curdate() GROUP BY DATE(tdstamp), event order by DATE(tdstamp) DESC, c desc";
	
$data = array();

#Make the query
$result= mysqli_query($link,$query);
while($row = mysqli_fetch_assoc($result)) {
	$data[] = $row['reporter'];
}



mysqli_close($link);

echo json_encode($data);
?>