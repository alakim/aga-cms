define(["html", "db", "util", "forms/taskEdit"], function($H, db, util, taskEdit){
	var templates = {
		main: function(data){with($H){
			var prjID = db.getTaskProject(data.id),
				prj = db.getProject(prjID);
			
			var total = 0;
			$.each(data.jobs, function(i, job){
				total += job.hours;
			});
			
			if(data.resources && data.resources.length){
				data.resources = data.resources.sort(function(r1, r2){
					return r1.priority==r2.priority?0:r1.priority>r2.priority?-1:1;
				});
			}
			
			return div(
				h3("Task of Project: ", prj.name),
				templates.path(db.getPath(data.id), data.id),
				ul({"class":"menu"},
					li({"class":"bt_ViewProject", taskID:data.id}, "View Project"),
					li({"class":"bt_Edit", taskID:data.id}, "Edit Task")
				),
				table(
					tr(th("ID"), td(data.id)),
					tr(th("Name"), td(data.name)),
					tr(th("Date"), td(data.date)),
					data.deadline?tr(th({"class":"deadline"}, "Deadline"), td({"class":"deadline"}, data.deadline)):null,
					tr(th("Description"), td(util.formatHTML(data.description))),
					data.initiator?tr(th("Initiator"), td(templates.personRef(data.initiator))):null,
					data.executor?tr(th("Executor"), td(templates.personRef(data.executor))):null,
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
					data.resources && data.resources.length?(
						tr(th("Resources"), td(
							apply(data.resources, function(res, i){
								return div(
									span({style:"font-weight:bold;", title:"priority:"+res.priority}, res.name), ": ",
									res.type=="text"?span(res.value)
										:res.type=="hlink"?a({href:res.value, target:"_blank"}, res.value)
										:res.type=="reslink"?span(
											//span("Project resource ", a({href:"#"}, res.value))
											templates.projectResource(prj, res.value)
										)
										:null
								);
							})
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
		}},
		personRef: function(persID){with($H){
			var pers = db.getPerson(persID);
			return span(
				a({href:"#", "class":"lnkPerson", persID:persID}, pers.name)
			);
		}},
		path: function(path, curTaskID){with($H){
			return div({"class":"path"},
				apply(path, function(step, i){
					return markup(
						i>0?" / ":null,
						step.id==curTaskID?span(step.name)
							:a({href:"#"}, 
								i==0?{prjID:step.id}:{taskID:step.id},
								step.name
							)
					);
				})
			);
		}},
		projectResource:function(prj, resID){with($H){
			var res = prj.resources[resID];
			return span(
				res.type=="site"?a({href:res.url, target:"_blank"}, res.url)
					:res.type=="person"?templates.personRef(res.personID)
					:res.type=="text"?span(res.description)
					:null
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
	
	function viewPerson(e){
		var persID = $(e.target).attr("persID");
		require("forms/personView").view($(".mainPanel"), persID);
	}
	
	function followPath(e){
		var prjID = $(e.target).attr("prjID"),
			taskID = $(e.target).attr("taskID");
		if(prjID)
			require("forms/projectView").view(prjID, $(".mainPanel"));
		else if(taskID)
			viewer.view(taskID, $(".mainPanel"));
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
			pnl.find(".lnkPerson").click(viewPerson);
			pnl.find(".path a").click(followPath)
		}
	};
	return viewer;
});