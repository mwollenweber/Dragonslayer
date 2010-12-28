<html>
<title>Upload the latest patchy file</title>
<body>
<form enctype="multipart/form-data" action="submit_patchy.psp" method="POST">
<input type="hidden" name="MAX_FILE_SIZE" value="1000000" />
   Choose a file to upload: <input name="patchy_file" type="file" /><br />
<input type="submit" value="Upload File" />
</form>

</body>
</html>