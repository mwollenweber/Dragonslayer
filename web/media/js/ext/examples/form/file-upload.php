<?php
    sleep(1);
	move_uploaded_file($_FILES["photo-path"]["tmp_name"], "uploads/" . $_FILES["photo-path"]["name"]);
    
    echo '{success:true, file:'.json_encode($_FILES['photo-path']["name"]).'}';
    
?>