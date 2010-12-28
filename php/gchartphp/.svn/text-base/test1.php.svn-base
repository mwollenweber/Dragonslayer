<?
ini_set('display_errors', 1);
require('gChart.php');

?>

<html>
<head>
<title>PHP Wrapper for Google Chart API - Serverside Rendering - 0.1</title>
</head>
<body>

<h2>Grouped Bar Chart</h2>
<?php
$barChart = new gBarChart(500,150,'g');
$barChart->addDataSet(array(112,315,66,40));
$barChart->addDataSet(array(212,115,366,140));
$barChart->addDataSet(array(112,95,116,140));
$barChart->setColors(array("ff3344", "11ff11", "22aacc"));
$barChart->setLegend(array("first", "second", "third"));
$barChart->setGradientFill('c',0,array('FFE7C6',0,'76A4FB',1));
$barChart->setAutoBarWidth();
?>
<img src="<?php print $barChart->getUrl();  ?>" /> <br> grouped bar chart using the gGroupedBarChart class.
<br>
<h2> take 2</h2>
<?php
$barChart = new gBarChart(500,150,'g');
$barChart->addDataSet(array(112,315,66,40, 399));
$barChart->setColors(array("ff3344"));
$barChart->setLegend(array("first"));
$barChart->setGradientFill('c',0,array('FFE7C6',0,'76A4FB',1));
$barChart->setAutoBarWidth();
?>
<img src="<?php print $barChart->getUrl();  ?>" /> <br> grouped bar chart using the gGroupedBarChart class.

</body>
</html>