<?

error_reporting(E_ALL);
ini_set("display_errors", 1); 
ini_set("log_errors", 1); 


include 'mysql_conn.php';

$sq1 = "SELECT id, tdstamp, event, INET_NTOA(victim), INET_NTOA(attacker), dns_name, network, verification from gwcases where victim = INET_ATON('";
$sq2 = "') ORDER BY tdstamp";

?>

<html>
<title> DragonSlayer Search</title>
<h1>DragonSlayer Search</h1>
<br>
<h3>Search for IP:</h3>
<br>
<form name="searchip" action=
<? 
$ip = mysql_real_escape_string ($_GET["ip"]);
if(is_null($ip))
{
  die();
}

$table_str = <<<EOS
<h3>Results: </h3>
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
EOS;

print $table_str;

$results = mysql_query($sq1 . $ip .  $sq2)  or die(mysql_error());



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

mysql_close();


?>
</tr>

</html>