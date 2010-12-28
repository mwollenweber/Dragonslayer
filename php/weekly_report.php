<html>
<head>
<meta http-equiv="refresh" content="60">
</head>
<body>
<title>Weekly Report</title>
<h1> Dragonslayer</h1>
<h3> Weekly Report</h3>
<table border="1">
<tr>
<th>Device Name</th>
<th>IP Address</th>
<th>School/Department</th>
<th>Date & Timeof Compromise</th>
<th>Patchlink</th>
<th>Last Patchlink Check-In</th>
<th>Notes</th>
</tr>
<? 

function cmp($a, $b)
{

  if($a == $b)
    {
      return 0;
    }

  return ($a[4] > $b[4]) ? -1:1;

}

include('mysql_conn.php');
error_reporting(E_ALL);
//ini_set('display_errors', true);
//ini_set('html_errors', false);


$patchy_query = "SELECT dev_name, tdstamp FROM patchy WHERE INET_NTOA(ip) = '";
$network_query_start = "SELECT name FROM netblocks where INET_ATON('";
$network_query_end = "') BETWEEN start and end ORDER BY tdstamp DESC limit 1";
$weekly_ips_query = "SELECT INET_NTOA(victim), network, discovered, notes FROM gwcases WHERE (report_category >= 100) AND DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), DAYOFWEEK(CURDATE())) and CURDATE() GROUP BY victim ORDER BY tdstamp, victim";

$ip_results = mysql_query($weekly_ips_query);

//results table
//0     , 1 , 2      , 3            , 4     , 5     , 6
//device, ip, network, time and date, patchy, update, notes

//get ips for the week
$ip_count = mysql_num_rows($ip_results);

for($x = 0; $x < $ip_count; $x++)
  {
    $results_table[$x][0] = "";
    $tmp = mysql_fetch_array($ip_results);
    $results_table[$x][1] = $tmp[0];
    $discovered = $tmp[2];

    if(strlen($discovered) < 3)
      {
	$discovered = "&nbsp;";
      }
    elseif($discovered == "0000-00-00 00:00:00")
      {
	$discovered = "&nbsp;";
      }


    
    //notes
    $notes = $tmp[3];
    if(strlen($notes) < 3)
      {
	$notes = "&nbsp;";
      }

    $results_table[$x][6] = $notes;

    
    $patchy_results = mysql_query($patchy_query . $results_table[$x][1] . "' ORDER by id DESC limit 1");
    if($patchy_results != null)
      {
	$patchy_row = mysql_fetch_array($patchy_results);
      }
    else
      {
	$patchy_row = null;
      }
        
    if($patchy_row !=null)
      {
	//dev_name & tdstamp
	$results_table[$x][0] = $patchy_row[0];
	$results_table[$x][3] = $discovered; //date
	$results_table[$x][4] = "YES";
	$results_table[$x][5] = $patchy_row[1];
      } 

    else
      {
	$results_table[$x][0] = "&nbsp;";
	$results_table[$x][3] = $discovered; //date
	$results_table[$x][4] = "NO";
	$results_table[$x][5] = "&nbsp;";
      }

    //$network_name_results = mysql_query($network_query_start . $results_table[$x][1] . $network_query_end);
    //$network_name = mysql_fetch_array($network_name_results);
    $network_name = $tmp[1];

    if($network_name != null)
      {
	$results_table[$x][2] = $network_name;
      }
    else
      {
	$results_table[$x][2] = "Other";
      }
  }

usort($results_table, "cmp");

for($i = 0; $i < $ip_count; $i++) 
{
  echo "<tr>";
  print("\n");
  for($j = 0; $j < 7; $j++)
    {
      print("\n");
      echo "<td>";
      echo $results_table[$i][$j];
      echo "</td>";
    }
  echo "</tr>";
print("\n");
}

?>
</table>
<br>
<? include('report_graph1.inc'); ?>
</body>

<? mysql_close(); ?>

</html>