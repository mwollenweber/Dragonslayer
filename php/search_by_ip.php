<?
ini_set("display_errors", 1); 
ini_set('log_errors', 1); 
error_reporting(E_ALL);


include 'mysql_conn.php';

$ip = $_GET["ip"];


include '/var/www/html/search_response_body.php'; 
echo $body_start;
   
if(!is_null($ip))
  {
    
    $search_ip_query = 
      "SELECT id, tdstamp, reporter, event, INET_NTOA(victim), INET_NTOA(attacker), dns_name, network, verification FROM gwcases WHERE INET_NTOA(victim)='%s' ORDER BY tdstamp";
    $search_ip_query = sprintf($search_ip_query, $ip);
    $results = mysql_query($search_ip_query);

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
