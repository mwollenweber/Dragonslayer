<?php 
/** 
 * @author Brandon Dixon
 * @desc Utility functions for gathering data
 * @return JSON object
 */

include 'database/mongo/database_connection.php';
include 'database/mysql/database_connection.php';
if ($collection == null) { die('Collection null. Check include'); } //double check our connection state
if ($link == null) { die('Link null. Check include'); } //double check our connection state

include('score_functions.php');
include('content_functions.php');
include('scan_functions.php');
include('hash_functions.php');
include('structure_functions.php');
include('full_functions.php');
include('submit_file.php');
include('status_functions.php');

?>