<?php
/*
 * @author Brandon Dixon
 * @date 02/07/2011
 * @description Validates an analyst login
 * @return JSON object
 */

include('../database/database_connection.php');

#JSON is expected on the client side
header("Content-type: text/json");

$data = array();

//clean up the input
$username = addslashes(isset($_POST["loginUsername"]) ? $_POST["loginUsername"] : "");
$password = addslashes(isset($_POST["loginPassword"]) ? $_POST["loginPassword"] : "");
$password_hash = sha1($password); //no salt

session_start(); 
$date = date('Y-m-d H:i:s');

$query = "SELECT * FROM analysts WHERE username='$username' and password='$password_hash'";

$result = mysqli_query($link,$query);
$row = mysqli_num_rows($result);
$row_data = mysqli_fetch_assoc($result);

if($row >= 1) {
	$update_activity = "UPDATE analysts SET last_login = '$date' WHERE username = '$username'";
	mysqli_query($link,$update_activity);
	$_SESSION['login_user'] = $username; //add the user to the session
	$_SESSION['user_role'] = $row_data['role']; //add their role for later
	$data['success'] = "true";
} else {
	$data['success'] = "false";
	$data['errors'] = "wrong username/password combination";
}

echo json_encode($data);
?>