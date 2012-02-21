<?php 

$host="localhost";
$database ="dragonslayer";
$collection ="cases";

global $collection;

try {
	$conn = new Mongo($host);
	$db = $conn->$database;
	$collection = $db->$collection;

} catch (MongoConnectionException $e) {
	die('Error connecting to MongoDB server');
} catch (MongoException $e) {
	die('Error: ' . $e->getMessage());
}

?>
