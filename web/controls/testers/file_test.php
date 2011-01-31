<?php 
    sleep(1);
	move_uploaded_file($_FILES["patchy_file"]["tmp_name"], "uploads/" . $_FILES["patchy_file"]["name"]);
    
    echo '{success:true, file:'.json_encode($_FILES['patchy_file']["name"]).'}';
    
?>