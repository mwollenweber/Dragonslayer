<?php 
include('controls/database/lock.php');
$_SESSION['dsid'] = $_GET['dsid'];
$_SESSION['aip'] = $_GET['aip'];
$_SESSION['vip'] = $_GET['vip'];
?>

<html>
	<head>
		<title>Dragon Slayer 2 (so metal)</title>
		
		<!-- CSS -->
		<link href="extjs/resources/css/ext-all.css" media="screen" rel="stylesheet" type="text/css" />
		<link href="style/shared.css" media="screen" rel="stylesheet" type="text/css" />
		
		<!-- ExtJS Requirements -->
		<script src="extjs/adapter/ext/ext-base.js" type="text/javascript"></script>
		<script src="extjs/ext-all-debug.js" type="text/javascript"></script>
		<script src="extjs/examples/ux/ux-all-debug.js" type="text/javascript"></script>
		
		<!-- Plugins -->
		<script src="extjs/adapter/highcharts/ext-highcharts-adapter.js" type="text/javascript"></script>
		<script src="script/highcharts/highcharts.src.js" type="text/javascript"></script>
		<script src="extjs/adapter/highcharts/Ext.ux.HighChartPanel.js" type="text/javascript"></script>
		<script src="extjs/adapter/highcharts/Ext.ux.HighChart.js" type="text/javascript"></script>
		
		<script src="extjs/adapter/portal/Ext.ux.Portal.js" type="text/javascript"></script>
		<script src="extjs/adapter/portal/Ext.ux.PortalColumn.js" type="text/javascript"></script>
		<script src="extjs/adapter/portal/Ext.ux.Portlet.js" type="text/javascript"></script>
		
		<script src="extjs/adapter/form/FileUploadField.js" type="text/javascript"></script>
		
		<script src="extjs/adapter/Ext.ux.Printer/Printer.js" type="text/javascript" ></script>
		<script src="extjs/adapter/Ext.ux.Printer/renderers/Base.js" type="text/javascript"></script>
		<script src="extjs/adapter/Ext.ux.Printer/renderers/Base.js" type="text/javascript"></script>
		
		<script src="extjs/adapter/Ext.ux.Exporter/Exporter-all.js" type="text/javascript"></script>
		
		<script src="extjs/adapter/Ext.ux.RowEditor/RowEditor.js" type="text/javascript"></script>
		
		<!-- Portlets -->
		<script src="script/portlets/daily_bad_filtered_portlet.js" type="text/javascript"></script>
		<script src="script/portlets/daily_mdl_portlet.js" type="text/javascript"></script>
		<script src="script/portlets/weekly_report_graph_portlet.js" type="text/javascript"></script>
		<script src="script/portlets/weekly_report_portlet.js" type="text/javascript"></script>
		<script src="script/portlets/weekly_contribution_graph_portlet.js" type="text/javascript"></script>
		<script src="script/portlets/past_30_day_events_graph_portlet.js" type="text/javascript"></script>
		<script src="script/portlets/recent_vip_cases_portlet.js" type="text/javascript"></script>
		<script src="script/portlets/unentered_cases_portlet.js" type="text/javascript"></script>
		<script src="script/portlets/search_by_type_portlet.js" type="text/javascript"></script>
		<script src="script/portlets/scratch_pad_portlet.js" type="text/javascript"></script>
		<script src="script/portlets/top_10_events_30_days.js" type="text/javascript"></script>
		<script src="script/portlets/top_10_networks_30_days.js" type="text/javascript"></script>
		<script src="script/portlets/top_report_categories_30_days.js" type="text/javascript"></script>
		
		<!-- Pages and Views -->
		<script src="script/viewport.js" type="text/javascript"></script>
		<!-- <script src="script/logger.js" type="text/javascript"></script> -->
		<script src="script/welcome.js" type="text/javascript"></script>
		<script src="script/chart.js" type="text/javascript"></script>
		<script src="script/queries.js" type="text/javascript"></script>
		<script src="script/actions.js" type="text/javascript"></script>
		<script src="script/reports.js" type="text/javascript"></script>
		<script src="script/launchers.js" type="text/javascript"></script>
		<script src="script/accounts.js" type="text/javascript"></script>
		<script src="script/training.js" type="text/javascript"></script>
		<script src="script/helper_docs.js" type="text/javascript"></script>		
		
		<!-- Queries -->
		<script src="script/queries/daily_critical.js" type="text/javascript"></script>
		<script src="script/queries/daily_mdl.js" type="text/javascript"></script>
		<script src="script/queries/daily_bad_filtered.js" type="text/javascript"></script>
		<script src="script/queries/weekly_cases.js" type="text/javascript"></script>
		
		<!-- Actions -->
		<script src="script/actions/create_case.js" type="text/javascript"></script>
		<script src="script/actions/edit_case.js" type="text/javascript"></script>
		<script src="script/actions/search_by_type.js" type="text/javascript"></script>
		
		<!-- Reports -->
		<script src="script/reports/student_report.js" type="text/javascript"></script>
		<script src="script/reports/weekly_report.js" type="text/javascript"></script>
		<script src="script/reports/generate_report.js" type="text/javascript"></script>
		<script src="script/reports/display_report.js" type="text/javascript"></script>
		
		<!-- Launchers -->
		<script src="script/launchers/dragon_interface.js" type="text/javascript"></script>
		<script src="script/launchers/patchy_upload.js" type="text/javascript"></script>
		<script src="script/launchers/forensic_case.js" type="text/javascript"></script>
		<script src="script/launchers/malware_uploader.js" type="text/javascript"></script>
		
		<!-- Accounts -->
		
		<!-- Training -->
		<script src="script/training/videos.js" type="text/javascript"></script>
			  
	</head>
	
	<body>
	
		<form id="super_form" method="post" action="/file/">
	    	<input type="hidden" id="download" name="download" />
		</form>
	
		<!--  Queries -->
		<ul id="dragonslayer-queries-content" class="x-hidden">
		    <li>
		        <img src="images/information.png" class="icon-show-active"/>
		        <a class="dragonslayer-queries-dailycritical dragonslayer-nav-link" href="#" name="openDailyCritical">Daily Critical</a>
		    </li>
		    <li>
		        <img src="images/information.png" class="icon-show-active"/>
		        <a class="dragonslayer-queries-dailymdl dragonslayer-nav-link" href="#" name="openDailyMdl">Daily MDL</a>
		    </li>	
		    <li>
		        <img src="images/information.png" class="icon-show-active"/>
		        <a class="dragonslayer-queries-dailybadfiltered dragonslayer-nav-link" href="#" name="openDailyBadFiltered">Daily Bad Filtered</a>
		    </li>	
		    <li>
		        <img src="images/information.png" class="icon-show-active"/>
		        <a class="dragonslayer-queries-weeklycases dragonslayer-nav-link" href="#" name="openWeeklyCases">Weekly Cases</a>
		    </li>			    		  	    
		</ul>
		
		<!-- Actions -->
		<ul id="dragonslayer-actions-content" class="x-hidden">
		    <li>
		        <img src="images/add.png" class="icon-show-active"/>
		        <a class="dragonslayer-actions-createcase dragonslayer-nav-link" href="#" name="openCreateCase">Create Case</a>
		    </li>
		    <li>
		        <img src="images/cog_edit.png" class="icon-show-active"/>
		        <a class="dragonslayer-actions-editcase dragonslayer-nav-link" href="#" name="openEditCase">Edit Case</a>
		    </li>
		    <li>
		        <img src="images/View.png" class="icon-show-active"/>
		        <a class="dragonslayer-actions-searchbytype dragonslayer-nav-link" href="#" name="openSearchByType">Search</a>
		    </li>		    
		</ul>
		
		<!-- Reports -->
		<ul id="dragonslayer-reports-content" class="x-hidden">
		    <li>
		        <img src="images/list_users.gif" class="icon-show-active"/>
		        <a class="dragonslayer-reports-studentreport dragonslayer-nav-link" href="#" name="openStudentReport">Student Report</a>
		    </li>
		    <li>
		        <img src="images/date.gif" class="icon-show-active"/>
		        <a class="dragonslayer-reports-weeklyreport dragonslayer-nav-link" href="#" name="openWeeklyReport">Weekly Report</a>
		    </li>
    		<li>
		        <img src="images/Diagram.png" class="icon-show-active"/>
		        <a class="dragonslayer-reports-generatereport dragonslayer-nav-link" href="#" name="openGenerateReport">Generate Report</a>
		    </li>
		</ul>
		
		<!-- Launchers -->
		<ul id="dragonslayer-launchers-content" class="x-hidden">
		    <li>
		        <img src="images/Radiation.png" class="icon-show-active"/>
		        <a class="dragonslayer-launchers-dragoninterface dragonslayer-nav-link" href="#" name="openDragonInterface">Dragon Interface</a>
		    </li>
   		    <li>
		        <img src="images/Upload.png" class="icon-show-active"/>
		        <a class="dragonslayer-launchers-patchyupload dragonslayer-nav-link" href="#" name="openPatchyUpload">Patchy Upload</a>
		    </li>
    		<li>
		        <img src="images/Computer 16x16.png" class="icon-show-active"/>
		        <a class="dragonslayer-launchers-forensiccase dragonslayer-nav-link" href="#" name="openForensicCase">Forensic Case</a>
		    </li>
     		<li>
		        <img src="images/Eye.png" class="icon-show-active"/>
		        <a class="dragonslayer-launchers-malwareuploader dragonslayer-nav-link" href="#" name="openMalwareUploader">Malware Uploader</a>
		    </li>
		</ul>
		
		<!-- Accounts -->
		<ul id="dragonslayer-accounts-content" class="x-hidden">
		    <li>
		        <img src="images/icon_user.gif" class="icon-show-active"/>
		        <a class="dragonslayer-accounts-myaccount dragonslayer-nav-link" href="#" name="openMyAccount">My Account</a>
		    </li>
		</ul>
		
		<!-- Training -->
		<ul id="dragonslayer-training-content" class="x-hidden">
		    <li>
		        <img src="images/About.png" class="icon-show-active"/>
		        <a class="dragonslayer-training-videos dragonslayer-nav-link" href="#" name="openVideoTraining">Videos</a>
		    </li>
		</ul>
	
	</body>
</html>

