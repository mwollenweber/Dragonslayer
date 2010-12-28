<?

include 'mysql_conn.php';

function ipcheck()
{
  $q1 = "SELECT victim FROM gwcases WHERE INET_NTOA(victim)='";
  $q2 = "' and DATE(tdstamp) BETWEEN CURDATE()-6 and CURDATE()";
  $ip = $_GET["ip"];
  if(is_null($ip))
    {
      echo "0";
      return;
    }
  //echo "query = " . $q1 . $ip . $q2;
  $results = mysql_query($q1 . $ip . $q2);
  $res_array = mysql_fetch_array($results);
  if(is_null($res_array)){ echo "0"; return;}
  
  if(strlen($res_array[0]) > 1)
    {
      echo "1";
      return;
    }
  
  echo "0";
  return;

}
?>
<html>
<?ipcheck();?>
</html>

