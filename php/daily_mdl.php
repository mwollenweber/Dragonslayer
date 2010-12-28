<?
include 'mysql_conn.php';
$q1 = "select tdstamp, event, INET_NTOA(victim), INET_NTOA(attacker), description from hourly_dragon_mdl GROUP BY victim,attacker ORDER BY victim";

?>


<html>
<head>
<meta http-equiv="refresh" content="600">
</head>
<body>
<title>MDL and Alerts</title>
<h1> Dragonslayer</h1>
<h3> MDL and Alerts</h3>
<table border="1">
<th>Date</th>
<th>Event</th>
<th>Victim</th>
<th>Attacker</th>
<th>Notes</th>
 
<? 
$results = mysql_query($q1);

while($row = mysql_fetch_row($results))
  {
    echo "<tr>";
    foreach($row as $x)
      {
	echo "<td>";
	if($x == null)
	  {
	    echo "Unknown";
	  }
	else
	  {
	    echo htmlentities($x);
	  }

	echo "</td>\n";
      }
    echo "</tr>";
  }

?>

</table>
</body>


</html>