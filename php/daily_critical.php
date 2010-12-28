<?
include 'mysql_conn.php';


//$q1 = "select tdstamp, event, INET_NTOA(victim), INET_NTOA(attacker) from hourly_dragon_mdl GROUP BY victim,attacker ORDER BY victim";
#$q1 = "select tdstamp, event, INET_NTOA(dstip), INET_NTOA(srcip)  from dragon where (dragon.dstip = ANY (SELECT ip from critical) AND DATE(tdstamp) BETWEEN CURDATE()-1 and CURDATE()) GROUP BY srcip, dstip, event ORDER BY DATE(tdstamp), dstip, srcip";
$q1 = "select tdstamp, event, INET_NTOA(dstip), INET_NTOA(srcip)  from dragon where (dragon.dstip = ANY (SELECT ip from critical) AND dragon.srcip NOT BETWEEN 2158231552 AND 2158297087 AND dragon.srcip NOT BETWEEN 2717712384 AND 2717777919 AND DATE(tdstamp) BETWEEN CURDATE()-1 and CURDATE()) GROUP BY srcip, dstip, event ORDER BY DATE(tdstamp), dstip, srcip";


?>


<html>
<head>
<meta http-equiv="refresh" content="600">
</head>
<body>
<title>Today's Events On The Critical List</title>
<h1> Dragonslayer</h1>
<h3> Critical Host Alerts for: <? $today = date("F j, Y g:i a");  echo $today; ?></h3>
<table border="1">
<th>Date</th>
<th>Event</th>
<th>Victim</th>
<th>Attacker</th>
 
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