
$(document).ready(function() {
	$("#full_methods").click(function () {
		$("#full").toggle();
	});
	
	$("#score_methods").click(function () {
		$("#scores").toggle();
	});
	
	$("#content_methods").click(function () {
		$("#content").toggle();
	});
	
	$("#scan_methods").click(function () {
		$("#scans").toggle();
	});
	
	$("#hash_methods").click(function () {
		$("#hashes").toggle();
	});
	
	$("#structure_methods").click(function () {
		$("#structure").toggle();
	});
	
	$(".sample").click(function() {
		$.ajax({
			url: $(this).text(),
			type: 'get',
//			dataType: 'json',
			success: function(data) {
				$("#results").html(data);
			},
			cache: false
		});
	})
});