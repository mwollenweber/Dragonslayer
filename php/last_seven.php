<?
include 'mysql_conn.php';


$weekly_ticket_query = 
  "SELECT id, tdstamp, reporter, event, INET_NTOA(victim), INET_NTOA(attacker), dns_name, network, verification FROM gwcases WHERE DATE(tdstamp) BETWEEN CURDATE()-6 and CURDATE() ORDER BY tdstamp";

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
<th>Analyst</th>
<th>Dragon Event</th>
<th>Victim</th>
<th>Attacker</th>
<th>DNS/Workstation</th>
<th>Network</th>
<th>Confirmation</th>
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

<br><br><br>

<?
$total_cases_query = "SELECT COUNT(*) FROM gwcases WHERE DATE(tdstamp) BETWEEN CURDATE()-6 and CURDATE()";
$student_case_query = "SELECT COUNT(*) from gwcases WHERE DATE(tdstamp) BETWEEN CURDATE()-6 and CURDATE() AND report_category=20";
$normal_case_query = "SELECT COUNT(*) FROM gwcases WHERE DATE(tdstamp) BETWEEN CURDATE()-6 and CURDATE() AND report_category=200";
?>

<h3> Counts:</h3>
<table border="1">
<tr>
<th>total count</th>
<th>student count</th>
<th>normal count</th>
</tr>
<tr>
<td>unavailable</td>
<td>unavailable</td>
<td>unavailable</td>
</tr>
</table>
<br><br><br>
</body>


</html>