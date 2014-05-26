define(["html", "db", "util"], function($H, db, util){

	var templates = {
		main: function(){with($H){
			return div({"class":"report"},
				div(
					input({type:"button", value:"Display report", "class":"btUpdate"}),
					" From: ", input({type:"text", "class":"fldFrom"}),
					" To: ", input({type:"text", "class":"fldTo"})
				),
				div({"class":"jobs"})
			);
		}},
		jobs: function(data){with($H){
			return ul(
				apply(data, function(job){
					return li(
						job.date, " ", 
						a({href:"#", "class":"lnkTask", taskID: job.id}, job.name),
						" (", job.hours, "h)", 
						job.notes?span(" - ", job.notes):null
					);
				})
			);
		}}
	};
	
	function showTask(){
		var taskID = $(this).attr("taskID");
		require("forms/taskView").view(taskID, $(".mainPanel"));
	}
	
	function update(){
		var dFrom = $(".fldFrom").val(),
			dTo = $(".fldTo").val();
		var data = db.getJobReport(dFrom, dTo);
		$(".report .jobs").html(templates.jobs(data))
			.find(".lnkTask").click(showTask);
	}

	return {
		view: function(pnl){
			pnl.html(templates.main())
				.find(".btUpdate").click(update);
			update();
		}
	};
});