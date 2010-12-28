<?
ini_set("display_errors", 1); 
ini_set('log_errors', 1); 
error_reporting(E_ALL);


$user="dragonslayer";
$passwd ="slayer";
$db = "dragonslayer";

$count = $_GET["count"];


include '/var/www/html/search_response_body.php'; 
echo $body_start;
   
if(!is_null($count))
  {

    mysql_connect("localhost", $user, $passwd)  or die(mysql_error());
    mysql_select_db($db) or die( "Unable to select database");
    
    $last_n_query = 
      "SELECT id, tdstamp, reporter, event, INET_NTOA(victim), INET_NTOA(attacker), dns_name, network, verification FROM gwcases ORDER BY tdstamp DESC limit %s";
    $last_n_query = sprintf($last_n_query, $count);
    $results = mysql_query($last_n_query);

    echo $response_body;
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
    print $body_end;

    mysql_close();
  }
 else
   {
     //print "need an ip";
     
   }


?>
