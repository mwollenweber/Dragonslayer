<?
$body_start = <<<STR1
<html>
<head>
<meta http-equiv "refresh" content "60">
</head>
<body>
<title>Search for Tickets</title>
<h1> Dragonslayer</h1>
<form name="ip_search_form" action="search_by_ip.php" method="get">
    IP: 
<input type="text" name="ip" />
<input type="submit" value="Submit" />
</form>

<br><br>
STR1;

$response_body = <<<STR2
<h3> Tickets Found </h3>
<table border="1">
<tr>
<th>dsid</th>
<th>Date</tdh>
<th>Analyst</th>
<th>Dragon Event</th>
<th>Victim</th>
<th>Attacker</th>
<th>DNS/Workstation</th>
<th>Network</th>
<th>Confirmation</th>
</tr>
STR2;

$body_end = <<<STR3
</table>

<br><br><br>
</body>
</html>
STR3;
?>