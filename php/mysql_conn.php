<?
$user="dragonslayer";
$passwd ="slayer";
$db = "dragonslayer";

mysql_connect("localhost", $user, $passwd)  or die(mysql_error());
mysql_select_db($db) or die( "Unable to select database");
?>