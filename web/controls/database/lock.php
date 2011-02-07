<?php 
include('database_connection.php');

session_start();
$user_check = $_SESSION['login_user'];

$query = "SELECT username FROM analysts where username='$user_check' AND active = 1";
$result = mysqli_query($link,$query);
$row = mysqli_fetch_array($result);

$login_session = $row['username'];

if(!isset($login_session)) {
	header('Location: http://128.164.80.84/web/login.php');
}
?>