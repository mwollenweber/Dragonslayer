<?php
include_once 'database_connection.php';
$type = $_POST["type"];

header("Content-type: text/json");

#Base Query
$query= "SELECT reporter, HOUR(tdstamp) as rtime, COUNT(reporter) as count, WEEK(tdstamp) as WEEK, date(tdstamp) as date from gwcases";

#Adjust query based on param
if ($type == 'week') {
	$query = $query . " WHERE YEARWEEK(tdstamp) = YEARWEEK(CURRENT_TIMESTAMP) AND reporter <> \"\" GROUP BY HOUR(tdstamp), reporter ORDER BY reporter, rtime DESC, count DESC";
} else {}

#Make the query
$result= mysqli_query($link,$query);

#Put the data in XML for the client to parse
$dom = new DOMDocument("1.0");
$node = $dom->createElement("JSChart");
$parnode = $dom->appendChild($node);
$dataset_node = $dom->createElement("dataset");
$newnode = $parnode->appendChild($dataset_node);
$newnode->setAttribute("type", "line");

while($row = mysqli_fetch_assoc($result)) {
	$data_node = $dom->createElement("data");
	$data_newnode = $dataset_node->appendChild($data_node);
	$data_newnode->setAttribute("unit", $row['date']);
	$data_newnode->setAttribute("value", $row['count']);
}

$dom->saveXML();
mysqli_close($link);

echo $dom->saveXML();

?>