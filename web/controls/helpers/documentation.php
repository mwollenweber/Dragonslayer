<?php 
/*
 * @author Brandon Dixon
 * @date 03/18/2011
 * @description Save/pull documentation for pages (generic function call)
 * @return JSON object
 */

include('../database/database_connection.php');
include('../authentication/role_check.php');

#JSON is expected on the client side
header("Content-type: text/json");

$data_result = array();
$proceed = false;
$type = addslashes($_POST['type']);
$name = addslashes($_POST['name']);
$user = addslashes($_POST['user']);
$helper_type = addslashes($_POST['helper_type']);
$content = addslashes($_POST['content']);
$date = date('Y-m-d H:i:s');

if($type == "push") {
	//check to see if this information has been entered before
	$query = "SELECT last_edit, last_user_edit, content FROM helper_docs WHERE name = '$name'";
	$result= mysqli_query($link,$query);
	$row = mysqli_fetch_assoc($result);
	
	if($user == $_SESSION['login_user']) {
		if($row == null) {
			$query = "INSERT INTO helper_docs (name, type, last_edit, last_user_edit, content) VALUES('$name', '$helper_type', '$date', '$user', '$content')";
			$result= mysqli_query($link,$query);
			$data_result['success'] = 'true';
		} else {
			$query = "UPDATE helper_docs SET content = '$content', last_edit = '$date', last_user_edit = '$user' WHERE name = '$name'";
			$result= mysqli_query($link,$query);
			$data_result['success'] = 'true';
		}
	}

} elseif($type == "pull") {
	$query = "SELECT last_edit, last_user_edit, content FROM helper_docs WHERE name = '$name'";
	$result= mysqli_query($link,$query);
	$row = mysqli_fetch_assoc($result);
	
	$data_result['last_edit'] = $row['last_edit'];
	$data_result['last_user_edit'] = $row['last_user_edit'];
	$data_result['content'] = $row['content'];
} else {
	
}

mysqli_close($link);

echo json_encode($data_result);

?>