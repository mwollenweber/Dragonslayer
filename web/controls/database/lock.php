<?php 
/*
 * @author Brandon Dixon
 * @date 02/07/2011
 * @description Check to make sure the user is authenticated
 * @return Redirects user if they aren't good
 */

include('database_connection.php');

session_start();
$user_check = $_SESSION['login_user'];

$query = "SELECT username FROM analysts where username='$user_check' AND active = 1";
$result = mysqli_query($link,$query);
$row = mysqli_fetch_array($result);

$login_session = $row['username'];

if(!isset($login_session)) {
	header('Location: https://128.164.80.105/ds2/web/login.php');
}

?>