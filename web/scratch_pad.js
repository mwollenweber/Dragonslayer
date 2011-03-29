Named functions single count, total count, average
==================================================

var map = function () {
    this.structure.keywords.keyword.forEach(
    	function (z) {
    		emit(z.name, {count_sum: z.count, count: 1});
		}
	);
}

var reduce = function (key, values) {
    var total = 0;
    var count = 0;
    var stotal = 0;
    for (var i = 0; i < values.length; i++) {
        stotal += values[i].count;
        total += values[i].count_sum;
	    count++;
    }
    return { count_sum:total, count: stotal };
}

db.malware.mapReduce(map,reduce, {out: "named_funcs" });

Named functions single count, total count, average (hex encoded)
================================================================

var map = function () {
    this.structure.keywords.keyword.forEach(function (z) {emit(z.name, {count_hex: z.hexcodecount, count:1});});
}

var reduce = function (key, values) {
    var total = 0;
    var count = 0;
    for (var i = 0; i < values.length; i++) {
if (values[i].count_hex > 0) {
        total += values[i].count_hex;
	    count++;
}
    }
	avg = total/count;
    return { count_hex:total, count: count};
}

db.malware.mapReduce(map,reduce, {out: "named_func_hex" });

Average filesize
================

var map = function () {
    emit({}, {total_file_size: this.structure.filesize, count: 1, avg: 0}); 
}

var reduce = function (key, values) { 
   var total = 0; 
   var count = 0; 
   for (var i = 0; i < values.length; i++) { 
       total += parseInt(values[i].total_file_size); 
       count += values[i].count; 
   } 
   avg = total/count; 
   return { total_file_size: total, avg: avg, count: count }; 
} 

db.malware.mapReduce(map,reduce, {out: "filesize" });

Average Entropy
================

var map = function () {
    emit({}, {tent: this.structure.totalEntropy, sent: this.structure.streamEntropy, nent: this.structure.nonStreamEntropy, total_ent:0,stream_ent:0,nonstream_ent:0,count:1});
}

var reduce = function (key, values) {
    var tent = 0;
    var sent = 0;
    var nent = 0;
    var count = 0;
    for (var i = 0; i < values.length; i++) {
        tent += parseFloat(values[i].tent);
        sent += parseFloat(values[i].sent);
        nent += parseFloat(values[i].nent);
        count += values[i].count;
    }
	tavg = tent/count;
	savg = sent/count;
	navg = nent/count;
    return { total_ent: tavg, stream_ent: savg, nonstream_ent: navg, count: count, tent: tent, sent: sent, nent: nent };
}

db.malware.mapReduce(map,reduce, {out: "all_entropy" });

Component totals and averages
================================================================

var map = function () {
    this.structure.components.component.forEach(
		function (z) {
			emit(z.name, {count: 0, total: z.count, avg:0});
		}
	);
}

var reduce = function (key, values) {
    var count = db.malware.count();
    var total = 0;
    for (var i = 0; i < values.length; i++) {
    		total += values[i].total;
    }
	avg = total/count;
    return { count: count, avg: avg, total: total};
}

db.malware.mapReduce(map,reduce, {out: "component_totals" });


Collective scanning
====================
var map = function () { 
    this.scans.virustotal.report.results.scanners.forEach( 
        function (z) { 
        	emit(z.antivirus, {signatures: [z.signature] , count: 1, total: 0}); 
        } 
    ); 
} 

var reduce = function (key, values) { 
    var count = 0; 
    var total = 0; 
    var sigs = []; 
    values.forEach( 
    	function(z){ 	
            total +=  z.count; 
            z.signatures.forEach(
        		function(y) {
        			if(y != "") { sigs.push(y); }
        		}
    		)
        } 
    ) 

    var newArray=new Array();
    label:for(var i=0; i<sigs.length;i++ ) {  
        for(var j=0; j<newArray.length;j++ ) {
            if(newArray[j]==sigs[i]) 
                continue label;
        }
        newArray[newArray.length] = sigs[i];
    }
    
    count = newArray.length;
    return { count: count, total: total, signatures: newArray }; 
} 