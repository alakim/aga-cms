define(["html", "db", "util", "forms/taskEdit"], function($H, db, util, taskEdit){
	var templates = {
		main: function(data){with($H){
			var prjID = db.getTaskProject(data.id),
				prj = db.getProject(prjID);
			
			var total = 0;
			$.each(data.jobs, function(i, job){
				total += job.hours;
			});
			
			return div(
				h3("Task of Project: ", prj.name),
				ul({"class":"menu"},
					li({"class":"bt_ViewProject", taskID:data.id}, "View Project"),
					li({"class":"bt_Edit", taskID:data.id}, "Edit Task")
				),
				table(
					tr(th("ID"), td(data.id)),
					tr(th("Name"), td(data.name)),
					tr(th("Date"), td(data.date)),
					tr(th("Description"), td(util.formatHTML(data.description))),
					data.initiator?tr(th("Initiator"), td(db.getPerson(data.initiator).name)):null,
					data.executor?tr(th("Executor"), td(db.getPerson(data.executor).name)):null,
					data.jobs && data.jobs.length?(
						tr(th("Jobs"), td(
							apply(data.jobs, function(job, i){
								return div(
									job.date, ": ", job.hours, "h ",
									job.notes
								);
							}),
							div("Total ", total, " hours")
						))
					):null,
					data.completed?tr(th("Completed"), td(data.completed)):null
				),
				data.tasks?div(
					h4("Subtasks"),
					templates.taskList(data.tasks)
				):null
			);
		}},
		taskList: function(taskList){with($H){
			return ul(
				apply(taskList, function(task){
					return li(
						span(
							task.completed?{"class":"completed"}:null,
							task.name
						), "  | ", a({href:"#", "class":"lnkTask", taskID:task.id}, "View"), " | ",
						task.tasks?templates.taskList(task.tasks):null
					);
				})
			);
		}}
	};
	
	function editTask(e){
		var taskID = $(e.target).attr("taskID");
		var prjID = db.getTaskProject(taskID);
		taskEdit.view(prjID, $(".mainPanel"), taskID);
	}
	function viewTask(e){
		var taskID = $(e.target).attr("taskID");
		var prjID = db.getTaskProject(taskID);
		viewer.view(taskID, mainPanel);
	}
	
	function viewProject(e){
		var taskID = $(e.target).attr("taskID");
		var prjID = db.getTaskProject(taskID);
		require("forms/projectView").view(prjID, $(".mainPanel"));
	}
	
	var mainPanel;
	
	var viewer = {
		view: function(id, pnl){
			mainPanel = pnl;
			pnl.html(templates.main(db.getTask(id)));
			pnl.find("th").attr({align:"right"});
			pnl.find(".bt_Edit").click(editTask);
			pnl.find(".bt_ViewProject").click(viewProject);
			pnl.find(".lnkTask").click(viewTask);
		}
	};
	return viewer;
});