<?php 
/*
 * @author Brandon Dixon
 * @date 03/18/2011
 * @description Save/pull documentation for pages (generic function call)
 * @return JSON object
 */

session_start(); //user would be saved in successful session

/*
 * @input username to be checked
 * @return boolean identifying whether or not that user is an admin
 */
function check_role($user) {
	$user = addslashes($user);
	$query = "SELECT role FROM analysts WHERE username = '$user'";
	if(mysqli_query($link,$query)) {
		$result = mysqli_query($link,$query);
		$row_data = mysqli_fetch_assoc($result);
		if($row_data['role'] == "administrator") {
			$proceed = true;
		} else {
			$proceed = false;
		}

	} else {
			$proceed = false;
	}
}

?>