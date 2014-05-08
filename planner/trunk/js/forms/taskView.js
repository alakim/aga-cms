define(["html", "db", "forms/taskEdit"], function($H, db, taskEdit){
	function template(data){with($H){
		return div(
			ul({"class":"menu"},
				li({"class":"bt_Edit", taskID:data.id}, "Edit")
			),
			table(
				tr(th("ID"), td(data.id)),
				tr(th("Name"), td(data.name)),
				data.initiator?tr(th("Initiator"), td(db.getPerson(data.initiator).name)):null,
				data.jobs && data.jobs.length?(
					tr(th("Jobs"), td(
						apply(data.jobs, function(job, i){
							return div(
								job.date, ": ", job.hours, "h"
							);
						})
					))
				):null,
				data.completed?tr(th("Completed"), td(data.completed)):null
			)
		);
	}}
	
	function editTask(e){
		var taskID = $(e.target).attr("taskID");
		var prjID = db.getTaskProject(taskID);
		taskEdit.view(prjID, $(".mainPanel"), taskID);
	}
	
	return {
		view: function(id, pnl){
			pnl.html(template(db.getTask(id)));
			pnl.find("th").attr({align:"right"});
			pnl.find(".bt_Edit").click(editTask);
		}
	};
});