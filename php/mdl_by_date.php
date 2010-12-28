<?
include 'mysql_conn.php';


$date = mysql_real_escape_string ($_GET["date"]) or die("seriously give me a date\n");

$q1 = " (SELECT dragon.tdstamp, dragon.event, INET_NTOA(dragon.srcip), INET_NTOA(dragon.dstip), mdl.description
        from dragon, mdl
        where
        dstip = ip and ((srcip < 2717712385 or srcip > 2717726975)
        and (srcip < 2158256129 or srcip > 2158257919))
        and event not like 'GWU-TEST-Random'
        and  DATE(dragon.tdstamp) = '%s'
        and  DATE(mdl.tdstamp) between CURDATE()-90 and CURDATE()
        GROUP BY dragon.srcip
        ORDER BY dragon.srcip, dragon.dstip, dragon.event)
        UNION
        (SELECT dragon.tdstamp, dragon.event, INET_NTOA(dragon.dstip), INET_NTOA(dragon.srcip), mdl.description
        from dragon, mdl
        where
        srcip = ip and ((dstip < 2717712385 or dstip > 2717726975)
        and (dstip < 2158256129 or dstip > 2158257919))
        and event not like 'GWU-TEST-Random'
        and  DATE(dragon.tdstamp) = '%s'
        and  DATE(mdl.tdstamp) between CURDATE()-90 and CURDATE()
        GROUP BY dragon.dstip
        ORDER BY dragon.dstip, dragon.srcip, dragon.event)";

$q1 = sprintf($q1, $date, $date);

?>


<html>
<head>
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
	    $x = htmlentities($x);
	    echo $x;
	  }

	echo "</td>\n";
      }
    echo "</tr>";
  }

?>

</table>
</body>


</html>