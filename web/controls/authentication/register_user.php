<?php 
/*
 * @author Brandon Dixon
 * @date 02/07/2011
 * @description Registers an analyst
 * @return JSON object
 */

include('../database/database_connection.php');

#JSON is expected on the client side
header("Content-type: text/json");

$data = array();
$process = true;

$username = addslashes($_POST['username']);
$email = addslashes($_POST['email']);
$password = $_POST['password'];
$confirm_password = $_POST['confirm_password'];
$first_name = addslashes($_POST['first']);
$last_name = addslashes($_POST['last']);

//NULL/empty checks
if(is_null($username)) {
	$process = false;
	$data['success'] = "false";
	$data['error'] = "please enter a username";	
}

if(is_null($email)) {
	$process = false;
	$data['success'] = "false";
	$data['error'] = "please enter an email";	
}

if(is_null($password)) {
	$process = false;
	$data['success'] = "false";
	$data['error'] = "please enter a password";	
}

if(is_null($confirm_password)) {
	$process = false;
	$data['success'] = "false";
	$data['error'] = "please confirm your password";	
}

//Make sure the passwords match 
if($password == $confirm_password) {
	$password_hash = sha1($password);
} else {
	$process = false;
	$data['success'] = "false";
	$data['error'] = "passwords did not match";
}

$password = addslashes($password);
$date = date('Y-m-d H:i:s');

if($process) {
	$query = "INSERT INTO analysts (username, password, email, first_name, last_name, active, last_login) VALUES('$username','$password_hash','$email','$first_name', '$last_name', 1, '$date')";
	if(mysqli_query($link,$query)) {
		$_SESSION['login_user'] = $username;
		$data['success'] = "true";
	} else {
		$data['success'] = "false";
		$data['error'] = "registration failed";
	}
}

echo json_encode($data);

?>