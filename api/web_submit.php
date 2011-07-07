<html>
	<head>
		<title>PDF Dropsite</title>
	</head>
	
	<body>
		<form enctype="multipart/form-data" action="uploader.php" method="post">
			<input type="hidden" name="maxFileSize" value="100000"/>
			<h1>Upload a Nasty PDF or a ZIP Full of Them</h1>
			<input name="uploadedFile" type="file"/><br/><br/>
			<input type="submit" value="Upload File"/>
		</form>
	</body>

</html>