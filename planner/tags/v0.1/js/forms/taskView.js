﻿define(["html", "dataSource", "forms/taskEdit"], function($H, ds, taskEdit){
	function template(data){with($H){
		return div(
			ul({"class":"menu"},
				li({"class":"bt_Edit", taskID:data.id}, "Edit")
			),
			table(
				tr(th("ID"), td(data.id)),
				tr(th("Name"), td(data.name)),
				data.initiator?tr(th("Initiator"), td(ds.getPerson(data.initiator).name)):null,
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
		var prjID = ds.getTaskProject(taskID);
		taskEdit.view(prjID, $(".mainPanel"), taskID);
	}
	
	return {
		view: function(id, pnl){
			pnl.html(template(ds.getTask(id)));
			pnl.find("th").attr({align:"right"});
			pnl.find(".bt_Edit").click(editTask);
		}
	};
});