<html> 
	<head> 
		<title>Malobjpdf API</title> 
		<link href="style/shared.css" media="screen" rel="stylesheet" type="text/css" /> 
		<meta name="viewport" content="width=320,user-scalable=false" /> 
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js" type="text/javascript"></script> 
		<script src="scripts/lib.js" type="text/javascript"></script> 
	</head> 
	
	<body> 
		<div id="wrapper"> 
			<div id="api">
				<h1><a href="#" id="full_methods">Full</a></h1>	
				<div id="full">
					<h2>Methods</h2>
					<p>Get full object: /full?</p>
					<h2>Arguments</h2>
					<p>hash={HASH} : MD5 Hash of file</p>
					<h2>Samples</h2>
					<a href="#" class="sample">http://127.0.0.1/mop_rest/api/full?hash=77807a2a3320b9de67ede2bc08f0c1dd</a>
					<hr>
				</div>
				
				<h1><a href="#" id="score_methods">Scores</a></h1>	
				<div id="scores">
					<h2>Methods</h2>
					<p>Get all scores: scores?hash={HASH}</p>
					<p>Get total score: scores/total?hash={HASH}</p>
					<p>Get primary score: scores/primary?hash={HASH}</p>
					<p>Get secondary score: scores/secondary?hash={HASH}</p>
					<h2>Arguments</h2>
					<p>hash={HASH} : MD5 Hash of file</p>
					<h2>Samples</h2>
					<a href="#" class="sample">http://127.0.0.1/mop_rest/api/scores?hash=77807a2a3320b9de67ede2bc08f0c1dd</a><br>
					<a href="#" class="sample">http://127.0.0.1/mop_rest/api/scores/total?hash=77807a2a3320b9de67ede2bc08f0c1dd</a><br>
					<a href="#" class="sample">http://127.0.0.1/mop_rest/api/scores/primary?hash=77807a2a3320b9de67ede2bc08f0c1dd</a><br>
					<a href="#" class="sample">http://127.0.0.1/mop_rest/api/scores/secondary?hash=77807a2a3320b9de67ede2bc08f0c1dd</a><br>
					<hr>
				</div>
				
				<h1><a href="#" id="content_methods">Contents</a></h1>
				<div id="content">
					<h2>Methods</h2>
					<p>Get object contents: contents/object?hash={HASH}&id={ID}</p>
					<p>Get all object contents: contents/objects?hash={HASH}</p>
					<p>Get all object IDs: contents/objects/ids?hash={HASH}</p>
					<h2>Arguments</h2>
					<p>hash={HASH} : MD5 Hash of file</p>
					<p>id={ID} : ID of object</p>
					<h2>Samples</h2>
					<a href="#" class="sample">http://127.0.0.1/mop_rest/api/contents/object?hash=77807a2a3320b9de67ede2bc08f0c1dd&id=1</a><br>
					<a href="#" class="sample">http://127.0.0.1/mop_rest/api/contents/objects?hash=77807a2a3320b9de67ede2bc08f0c1dd</a><br>
					<a href="#" class="sample">http://127.0.0.1/mop_rest/api/contents/objects/ids?hash=77807a2a3320b9de67ede2bc08f0c1dd</a><br>
					<hr>
				</div>
				
				<h1><a href="#" id="scan_methods">Scans</a></h1>	
				<div id="scans">
					<h2>Methods</h2>
					<p>Get all scan data: scans?hash={HASH}</p>
					<p>Get VirusTotal scan data: scans/virustotal?hash={HASH}</p>
					<p>Get Wepawet scan data: scans/wepawet?hash={HASH}</p>
					<h2>Arguments</h2>
					<p>hash={HASH} : MD5 Hash of file</p>
					<h2>Samples</h2>
					<a href="#" class="sample">http://127.0.0.1/mop_rest/api/scans?hash=77807a2a3320b9de67ede2bc08f0c1dd</a><br>
					<a href="#" class="sample">http://127.0.0.1/mop_rest/api/scans/virustotal?hash=77807a2a3320b9de67ede2bc08f0c1dd</a><br>
					<a href="#" class="sample">http://127.0.0.1/mop_rest/api/scans/wepawet?hash=77807a2a3320b9de67ede2bc08f0c1dd</a><br>
					<hr>
				</div>
				
				<h1><a href="#" id="hash_methods">Hashes</a></h1>				
				<div id="hashes">
					<h2>Methods</h2>
					<p>Get all hash data: hashes?hash={HASH}</p>
					<p>Get object hash: hashes/objects?hash={HASH}&id={ID}</p>
					<p>Get all object hashes: hashes/object?hash={HASH}</p>
					<p>Get all file hashes: hashes/file?hash={HASH}</p>
					<h2>Arguments</h2>
					<p>hash={HASH} : MD5 Hash of file</p>
					<h2>Samples</h2>
					<a href="#" class="sample">http://127.0.0.1/mop_rest/api/hashes?hash=77807a2a3320b9de67ede2bc08f0c1dd</a><br>
					<a href="#" class="sample">http://127.0.0.1/mop_rest/api/hashes/objects?hash=77807a2a3320b9de67ede2bc08f0c1dd</a><br>
					<a href="#" class="sample">http://127.0.0.1/mop_rest/api/hashes/object?hash=77807a2a3320b9de67ede2bc08f0c1dd&id=1</a><br>
					<a href="#" class="sample">http://127.0.0.1/mop_rest/api/hashes/file?hash=77807a2a3320b9de67ede2bc08f0c1dd</a><br>
					<hr>
				</div>
				
				<h1><a href="#" id="structure_methods">Structure</a></h1>
				<div id="structure">	
					<h2>Methods</h2>
					<p>Get all structure data: structure?hash={HASH}</p>
					<h2>Arguments</h2>
					<p>hash={HASH} : MD5 Hash of file</p>
					<h2>Samples</h2>
					<a href="#" class="sample">http://127.0.0.1/mop_rest/api/structure?hash=77807a2a3320b9de67ede2bc08f0c1dd</a><br>
					<hr>
				</div>
			</div>
			
			<div id="live_query">
				<h1>Results</h1>
				<div id="results"></div>
				<br><br>
				<div id="code_ref">
					<h1>Implementing in Python</h1>
					import simplejson<br>
					import urllib<br>
					import urllib2<br>
					
					url = "http://127.0.0.1/mop_rest/api/contents/object?"<br>
					params = { "hash":"77807a2a3320b9de67ede2bc08f0c1dd", "id":"1" }<br>
					data = urllib.urlencode(params)<br>
					req = urllib2.Request(url, data)<br>
					response = urllib2.urlopen(req)<br>
					json = response.read()<br>
					print json<br>
				</div>
			</div> 
		</div> 
	</body> 
 
</html>