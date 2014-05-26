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
			var total = 0;
			$.each(data, function(i, job){
				total+= +job.hours;
			});
			return div(
				ul(
					apply(data, function(job){
						var prjID = db.getTaskProject(job.id),
							prj = db.getProject(prjID);
						return li(
							job.date, " ", 
							a({href:"#", "class":"lnkTask", taskID: job.id}, prj.name, "/", job.name),
							" (", job.hours, "h)", 
							job.notes?span(" - ", job.notes):null
						);
					})
				),
				div("Total ", total, " hours")
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