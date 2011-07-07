<?php 
/** 
 * @author Brandon Dixon
 * @desc MongoDB tester
 * @return JSON object
 */

include 'controls/database/mongo/database_connection.php';
if ($collection == null) { die('Collection null. Check include'); } //double check our connection state

$criteria = array('hash_data.hashes.file.md5' => '04a82f084e8e61bcc513fe738e983b01');  
$fields = array('scores', "_id" => false);
$cursor = $collection->find($criteria,$fields);

foreach ($cursor as $obj) {
	echo json_encode($obj);
}
 
$cursor->rewind();
$conn->close();

?>