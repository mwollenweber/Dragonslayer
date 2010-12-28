<?
include 'mysql_conn.php';

$weekly_ticket_query = 
  "SELECT id, tdstamp, event, INET_NTOA(victim), INET_NTOA(attacker), dns_name, network, verification FROM gwcases WHERE DATE(tdstamp) BETWEEN CURDATE()-6 and CURDATE() ORDER BY tdstamp";

$q = "select * from dragon limit 10";
$results = mysql_query($weekly_ticket_query);
mysql_close()



?>


<html>
<head>
<meta http-equiv "refresh" content "60">
</head>
<body>
<title>Tickets over the last 7 days</title>
<h1> Dragonslayer</h1>
<h3> Tickets Between Today()-7 and Today() </h3>
<table border="1">
<tr>
<th>dsid</th>
<th>Date</tdh>
<th>Dragon Event</th>
<th>Victim</th>
<th>Attacker</th>
<th>DNS/Workstation</th>
<th>Network</th>
<th>Confirmation</t>
</tr>
<? 
#
while($row = mysql_fetch_row($results))
{
  echo "<tr>";
  
  $start = 1;
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

	  if($start == 1)
	  {
	    echo '<a href="/edit_case.php?dsid='. $x . '">' . $x . '</a>';
            $start = 0;	  
	  }
	  else
	  {
	    echo $x;
	  }
	}

      echo "</td>\n";
      //print  '     ';
    }
  echo "</tr>";
}
?>

</table>
</body>


</html>