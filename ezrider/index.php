<html>
	<head>
	<title>Case Statistics</title>
	<script type="text/javascript" src="script/lib.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js" type="text/javascript"></script>
	<script src="script/highcharts/highcharts.js" type="text/javascript"></script>
	<script src="script/filters/hour_count_charts.js" type="text/javascript"></script>
	<script src="script/filters/month_filter_charts.js" type="text/javascript"></script>
	<script src="script/filters/day_filter_charts.js" type="text/javascript"></script>
	<script src="script/filters/case_group_charts.js" type="text/javascript"></script>
	<script src="script/highcharts/modules/exporting.js" type="text/javascript"></script>
	</head>
	
	<body>
		<table border="1" cellpadding="5" cellspacing="0" width="1200">
			<tr><td align="left" valign="top" width="900">
					<div id="data"></div>
					<div id="chartdata">.</div>
				</td>
				<td align="left" valign="top" width="300">
					<h1>Filters</h1>
					<li>Current</li>
					<ul>
						<li><a href="#" id="week_link">Week</a><br></li>
						<ul>
							<li><a href="#" id="day_filter_mon">Mon</a><br></li>
							<li><a href="#" id="day_filter_tue">Tue</a><br></li>
							<li><a href="#" id="day_filter_wed">Wed</a><br></li>
							<li><a href="#" id="day_filter_thu">Thu</a><br></li>
							<li><a href="#" id="day_filter_fri">Fri</a><br></li>
							<li><a href="#" id="day_filter_sat">Sat</a><br></li>
							<li><a href="#" id="day_filter_sun">Sun</a><br></li>
						</ul>

						<li><a href="#" id="month_link">Month</a><br></li>
						<ul>
							<li><a href="#" id="month_filter_jan">Jan</a><br></li>
							<li><a href="#" id="month_filter_feb">Feb</a><br></li>
							<li><a href="#" id="month_filter_mar">Mar</a><br></li>
							<li><a href="#" id="month_filter_apr">Apr</a><br></li>
							<li><a href="#" id="month_filter_may">May</a><br></li>
							<li><a href="#" id="month_filter_jun">Jun</a><br></li>
							<li><a href="#" id="month_filter_jul">Jul</a><br></li>
							<li><a href="#" id="month_filter_aug">Aug</a><br></li>
							<li><a href="#" id="month_filter_sep">Sep</a><br></li>
							<li><a href="#" id="month_filter_oct">Oct</a><br></li>
							<li><a href="#" id="month_filter_nov">Nov</a><br></li>
							<li><a href="#" id="month_filter_dec">Dec</a><br></li>
						</ul>
							<li><a href="#" id="year_link">Year</a><br></li>
							<li><a href="#" id="cases_link">Cases</a><br></li>
					</ul>
					<li>Total</li>

				</td></tr>
		</table>
	</body>

</html>