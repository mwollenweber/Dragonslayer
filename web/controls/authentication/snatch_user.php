<?php 
include('../database/database_connection.php');
session_start();

#JSON is expected on the client side
header("Content-type: text/json");

$data = array();

$user_check = $_SESSION['login_user'];

$query = "SELECT username FROM analysts where username='$user_check'";
$result = mysqli_query($link,$query);
$row = mysqli_fetch_array($result);

$login_session = $row['username'];

if(!isset($login_session)) {
	$data['success'] = "false";
} else {
	$data['success'] = "true";
	$data['user'] = $login_session;
}

echo json_encode($data);

?>