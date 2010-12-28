<?
include 'mysql_conn.php';
$q0 = "DROP VIEW IF EXISTS badv";
$q1 = "CREATE view badv AS select tdstamp, event, victim, attacker, description from hourly_dragon_bad GROUP BY victim, event, attacker ORDER BY victim, event, tdstamp";
$q2 = "select tdstamp, event, INET_NTOA(victim), INET_NTOA(attacker), description from badv as bad where not EXISTS (select 1 from gwcases where bad.victim = gwcases.victim and DATE(gwcases.tdstamp) BETWEEN SUBDATE(CURDATE(), 7) AND CURDATE())";
?>


<html>
<head>
<meta http-equiv="refresh" content="600">
</head>
<body>
<title>MDL and ShadowServer Alerts</title>
<h1> Dragonslayer</h1>
<h3> MDL and ShadowServer Alerts</h3>
<table border="1" id="res_table" name="res_table">
<th>create case</th>
<th>Date</th>
<th>Event</th>
<th>Victim</th>
<th>Attacker</th>
<th>Notes</th>


<script>
function create_case(d)
{
  var row = document.getElementById('res_table').rows[d];
  var tdstamp = row.cells[1].innerHTML;
  var event = row.cells[2].innerHTML;
  var victim = row.cells[3].innerHTML;
  var attacker = row.cells[4].innerHTML;
  var notes = row.cells[5].innerHTML;

  //alert("Victim = " + victim);
  window.location = "create_case.php?auto=1&tdstamp=" + tdstamp +"&event=" + event + "&victim=" + victim + "&attacker=" + attacker + "&notes=" + notes;
}


</script>
 
<? 
mysql_query($q0);
mysql_query($q1);
$results = mysql_query($q2);
$row_count = 1;

while($row = mysql_fetch_row($results))
  {
    echo "<div id=$row_count name=$row_count>";
    echo "<tr>";
    echo "<td><center><a href='javascript:create_case($row_count);'>*</a></center></td>\n";
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
    echo "</div>";
    $row_count++;
  }

?>

</table>
</body>


</html>