<?
ini_set('display_errors', 1);
require('gchartphp/gChart.php');
#require('mysql_conn.php');

$q1 = "select count(id) as c, week(tdstamp) as w from gwcases where DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), 180) AND CURDATE() group by week(tdstamp) ORDER BY id, week(tdstamp)";
$q2 = "select count(id) as c, week(tdstamp) as w from gwcases where DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), 180) AND CURDATE() AND report_category = 20 group by week(tdstamp) ORDER BY id, week(tdstamp)"; 
$q3 = "select count(id) as c, week(tdstamp) as w from gwcases where DATE(tdstamp) BETWEEN SUBDATE(CURDATE(), 180) AND CURDATE() AND network like '%DIT%'  and  network not like '%guest%' GROUP BY week(tdstamp) ORDER BY id, week(tdstamp)";
$r1 = mysql_query($q1);
$r2 = mysql_query($q2);
$r3 = mysql_query($q3);
?>

<h2>GWU Weekly Compromises</h2>
<?
$i = 0;
while($asc_array = mysql_fetch_assoc($r1))
  {
    $total_count[] = $asc_array["c"];
    $total_week[] = $asc_array["w"];
    
    $i++;
  }

$min = (int) $total_week[$i-1];
$max = (int) $total_week[0];

while($asc_array = mysql_fetch_assoc($r2))
  {
    $student_count[] = $asc_array["c"];
    $student_week[] = $asc_array["w"];
  }

$i = 0;
while($asc_array = mysql_fetch_assoc($r3))
  {
    $dit_count[] = $asc_array["c"];
    $dit_week[] = $asc_array["w"];
  }



$lineChart = new gLineChart(900,300);
$lineChart->addDataSet($total_count);
$lineChart->addDataSet($student_count);
$lineChart->addDataSet($dit_count);
$lineChart->setLegend(array("Total Count", "Student Count", "DIT Count"));
$lineChart->setColors(array("ff3344", "11ff11", "3333aa", "22aacc"));
$lineChart->setVisibleAxes(array('x','y'));
$lineChart->setDataRange(0,80);
$lineChart->addAxisRange(0, $max, $min, 4);
$lineChart->addAxisRange(1, 0, 80);
$lineChart->addLineFill('B','76A4FB',0,0);
?>
<img src="<?php print $lineChart->getUrl();  ?>" /> <br>
