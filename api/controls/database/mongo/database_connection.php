<?php 
/** 
 * @author Brandon Dixon
 * @desc Make a connection to MongoDB
 * @return Collection object
 * 
 */

include("database_information.php");

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