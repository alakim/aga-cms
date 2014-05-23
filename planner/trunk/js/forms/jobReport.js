define(["html", "db", "util"], function($H, db, util){

	function template(data){with($H){
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
	
	function showTask(){
		var taskID = $(this).attr("taskID");
		require("forms/taskView").view(taskID, $(".mainPanel"));
	}

	return {
		view: function(pnl){
			var data = db.getJobReport();
			pnl.html(template(data));
			pnl.find(".lnkTask").click(showTask);
		}
	};
});