<?
include('mysql_conn.php');

$category = $_GET["category"];



$alert_query = 
  "SELECT id, tdstamp, reporter, report_category, event, INET_NTOA(victim), INET_NTOA(attacker), dns_name, network, verification FROM gwcases WHERE DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), DAYOFWEEK(CURDATE())) and CURDATE() and report_category >= 250 ORDER BY tdstamp";

   
$results = mysql_query($alert_query);

?>


<html>
<head>
<meta http-equiv "refresh" content "60">
</head>
<body>
<title>Alert Cases</title>
<h1> Dragonslayer</h1>
<? 
if(!is_null($category))
  {
    echo "<h2>";
    echo $category;
    echo " Cases</h2>";
  }

 else
   {
     echo "<h2>All Cases</h2>";
   }

?>
<h3> Between Sunday and Today </h3>
<table border="1">
<tr>
<th>dsid</th>
<th>Date</tdh>
<th>Analyst</th>
<th>Reporting Category</th>
<th>Dragon Event</th>
<th>Victim</th>
<th>Attacker</th>
<th>DNS/Workstation</th>
<th>Network</th>
<th>Confirmation</th>
</tr>
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
	  
	  if($col == 0)
	  {
	    $dsid = $x;
	    $dsid_str = '<a href="edit_case.php?dsid='. $x . '">' . $x . '</a>';

	    $category_query = sprintf("SELECT report_category from gwcases where id = %s", $dsid);
	    

	  }
	  elseif($col == 1)
	    {
	      //date
	      //simplify
	      $date = str_split($x, 10);
	      $date = $date[0];

	      if($date != $last_date)
		{
		  echo "</tr><tr><th colspan='10' bgcolor='silver' >New Day</th><tr>";
		  $last_date = $date;
		}

	      echo "<td>";
	      echo $dsid_str;
	      echo "</td>\n";
	      echo "<td>";
	      echo $x;
		  
	    }
	  elseif($col == 3)
	    {
	      switch($x)
		{
		case 200: 
		  echo "<td>Normal</td>\n";
		  break;
		case 20: 
		  echo "<td>Student</td>\n";
		  break;
		case 100:
		  echo "<td>DO NOT TICKET</td>\n";
		  break;
		case 300:
		  echo "<td>Server</td>\n";
		  break;
		case 250:
		  echo "<td>VIP</td>\n";
		  break;
		case 42:
		  echo "<td>Needs more research<\td>\n";
		  break;
		default:
		  echo "<td>Unknown</td\n";
		  break;
		  
		}
	      
	    }
	  elseif($col == 9)
	    {

	      echo "<td><textarea disabled='1'>";
	      echo $x;
	      echo "</textarea></td>\n";
	    }
	  else
	  {
	    echo "<td>";
	    echo $x;
	    echo "</td>\n";
	  }
	}

      
      $col = $col + 1;
    }
  echo "</tr>";
}
?>

</table>

<br><br><br>

<?
$total_cases_query = "SELECT COUNT(*) FROM gwcases WHERE DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), DAYOFWEEK(CURDATE())) and CURDATE()";
$student_case_query = "SELECT COUNT(*) from gwcases WHERE DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), DAYOFWEEK(CURDATE())) and CURDATE() AND report_category=20";
$normal_case_query = "SELECT COUNT(*) FROM gwcases WHERE DATE(tdstamp) BETWEEN  SUBDATE(CURDATE(), DAYOFWEEK(CURDATE())) and CURDATE() AND report_category=200";
$vip_case_query = "SELECT COUNT(*) FROM gwcases WHERE DATE(tdstamp) BETWEEN  SUBDATE(CURDATE(), DAYOFWEEK(CURDATE())) and CURDATE() AND report_category>200";


$results = mysql_query($total_cases_query) or die("mysql error" . mysql_error());
$total_cases = mysql_fetch_array($results);

$results = mysql_query($student_case_query) or die("mysql error" . mysql_error());   
$student_cases = mysql_fetch_array($results);


$results = mysql_query($normal_case_query) or die("mysql error" . mysql_error());   
$normal_cases = mysql_fetch_array($results);

$results = mysql_query($vip_case_query) or die("mysql error" . mysql_error());   
$vip_cases = mysql_fetch_array($results);


mysql_close()


?>

<H3> Counts:</h3>
<table border="1">
<tr>
<th>total count</th>
<th>student count</th>
<th>normal count</th>
<th>VIP count</th>
</tr>
<tr>
<td><a href="weekly_cases.php"><? printf("%s", $total_cases[0]);?></a></td>
<td><a href="student_report.php"><? printf("%s", $student_cases[0]);?></a></td>
<td><? printf("%s", $normal_cases[0]);?></td>
<td> <a href="weekly_cases.php?category=vip"><?printf("%s", $vip_cases[0]);?></a></td>
</tr>
</table>
<br><br><br>
</body>


</html>