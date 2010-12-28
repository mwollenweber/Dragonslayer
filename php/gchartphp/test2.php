<?
ini_set('display_errors', 1);
require('gChart.php');
require('../mysql_conn.php');

$q1 = "select count(id) as c, week(tdstamp) as w from gwcases where DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), 180) AND CURDATE() group by week(tdstamp) ORDER BY id, week(tdstamp)";
$results = mysql_query($q1);
?>

<html>
<head>
<title>PHP Wrapper for Google Chart API - Serverside Rendering - 0.1</title>
</head>
<body>
<h2>Total Compromises by Week</h2>
<?
$i = 0;
while($asc_array = mysql_fetch_assoc($results))
  {
    $count[] = $asc_array["c"];
    $week[] = $asc_array["w"];
    #print $week[$i];
    #print "<br>";

    $i++;
  }

$min = (int) $week[$i-1];
$max = (int) $week[0];

$lineChart = new gLineChart(900,300);
#$lineChart->addDataSet(array(112,125,66,40));
$lineChart->addDataSet($count);
$lineChart->setLegend(array("first"));
$lineChart->setColors(array("ff3344"));
$lineChart->setVisibleAxes(array('x','y'));
$lineChart->setDataRange(0,120);
$lineChart->addAxisRange(0, $max, $min, 4);
$lineChart->addAxisRange(1, 0, 130);
$lineChart->addLineFill('B','76A4FB',0,0);
?>
<img src="<?php print $lineChart->getUrl();  ?>" /> <br>

</body>
</html>