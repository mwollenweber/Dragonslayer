function attempt_login(uname,pword) {
	$.post("controls/validate_login.php", 
			{ uname: uname, pword: pword },
			   function(data){
			     alert("Data Loaded: " + data);
			   });
}

$(document).ready(function() {
	$("#submit_login").click(function() {
		uname = $("#username").val();
		pword = $("#password").val();
		attempt_login(uname, pword);
	});
});