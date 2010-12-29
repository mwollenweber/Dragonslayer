<?php 
//INCLUDE DATABASE CONNECTION

$uname = $_POST['uname'];
$pword = $_POST['pword'];

//Add a real way to authenticate later
if ($uname == "bsdixon") {
	echo "Success";
} else {
	echo "Fail";
}

?>