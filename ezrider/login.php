<html>
<head>
	<title>Login</title>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js" type="text/javascript"></script>
	<script src="script/login/broker.js" type="text/javascript"></script>
</head>

<body>
	<form action="" name="login_form" id="login_form">
		<td><h4>Login</h4></td>
		<table width="100%" border="0" cellpadding="3" cellspacing="1">
			<tr>
				<td width="78">Username</td>
				<td width="6">:</td>
				<td width="294"><input name="username" type="text" id="username" size="40"></td>
			</tr>
			<tr>
				<td>Password</td>
				<td>:</td>
				<td><input name="password" type="password" id="password" size="40"></td>
			</tr>
		</table>
		<input type="button" id="submit_login" name="button" value="Login">
	</form>
</body>

</html>