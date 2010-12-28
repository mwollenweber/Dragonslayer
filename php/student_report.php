<?

include 'mysql_conn.php';
$weekly_student_query = "select discovered, INET_NTOA(victim), event, notes, verification from gwcases where DATE(tdstamp) BETWEEN CURDATE()-DAYOFWEEK(CURDATE()) and CURDATE() and report_category=20";
$results = mysql_query($weekly_student_query);
?>


<html>
<head>
<meta http-equiv "refresh" content "60">
</head>
<body>
<title>Weekly Student</title>
<h1> Dragonslayer</h1>
<h3>Student Cases Between Sunday and Today </h3>
<table border="1">
<tr>
<th>Discovered</th>
<th>IP</tdh>
<th>Event</th>
<th>Notes/Username</th>
<th>Verification</th>
<? 
#

$last_date = "";
$total_count = 0;
$student_count = 0;
$normal_count = 0;

while($row = mysql_fetch_row($results))
{
  echo "<tr>";
  
  $col = 0;
  foreach($row as $x)
    {
      
      if($x == null)
	{
	  echo "<td>";
	  echo "Unknown";
	  echo "</td>\n";
	}
      else
	{
	  $x = htmlentities($x);
	  echo "<td>";
	  echo substr($x, 0, 124);
	  echo "</td>";
	  $col = $col + 1;
	}
    }
  echo "</tr>";
}

mysql_close()

?>

</table>

<br><br><br>

</body>


</html>