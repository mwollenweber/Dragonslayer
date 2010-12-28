<?

$cookie_arr = $_COOKIE;
$user_cookie = 0;
$username = "";

if(isset($_COOKIE["username"]))
  {
    $username = $_COOKIE["username"];
    $user_cookie = 1;
  }


//setcookie("cookiename", "value", $expire); time()+3600

?>