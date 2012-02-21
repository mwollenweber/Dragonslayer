<?php 
/*
 * @description pulls the current user from the session, checks to make sure they are real and returns their username
 * @return username of user and success boolean
 */
include('../database/database_connection.php');
session_start();

#JSON is expected on the client side
header("Content-type: text/json");

$data = array();

$user_check = $_SESSION['login_user'];
$user_check = addslashes($user_check);

$query = "SELECT username FROM analysts where username='$user_check'"; //make sure this user is good
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