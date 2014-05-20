define(["html", "db", "forms/taskEdit", "forms/resourceEdit"], function($H, db, taskEdit, resourceEdit){

	var templates = {
		main: function(prj){with($H){
			return div(
				h2(
					"Project ",
					prj.color?{style:"color:"+prj.color}:null,
					prj.name, " (", prj.id,")"
				),
				templates.menu(prj),
				templates.resources(prj.resources),
				templates.taskList(prj.tasks)
			);
		}},
		menu: function(prj){with($H){
			return ul({"class":"menu"},
				li({"class":"bt_AddTask"}, "Add Task"),
				li({"class":"bt_AddResource"}, "Add Resource")
			);
		}},
		taskList: function(taskList){with($H){
			if(!taskList || taskList.length==0) return;
			return div(
				h4("Tasks"),
				div({"class":"taskList"},
					apply(taskList, function(task, i){
						return templates.task(task);
					})
				)
			)
		}},
		resources: function(resList){with($H){
			if(!resList) return;
			return div(
				h4("Resources"),
				div({"class":"resourceList"},
					apply(resList, function(res, resID){
						return div(templates.resourceView(resID, res));
					})
				)
			);
		}},
		resourceView: function(id, data){with($H){
			return div(
				span({style:"font-weight:bold;"}, id, ": "), data.name
			);
		}},
		jobList: function(jobList){with($H){
			return div(
				ul(
					apply(jobList, function(job){
						return li(
							job.date, ": ", job.hours, "h",
							job.notes?markup(" - ", job.notes):null
						);
					})
				)
			);
		}},
		task: function(task){with($H){
			var qPos = db.getQueuePosition(task.id);
			return div({"class":"task"},
				h3(
					task.name, 
					task.id?span(" (", task.id,")"):null
					//   ," pos:", db.getTaskPosition(task.id)
				),
				qPos!=null?span({"class":"queuePos"}, qPos+1, " in queue"):null,
				div({style:"text-align:right; margin-right:300px;"},
					span({"class":"menu bt_Edit", taskID:task.id}, "Edit")
				),
				task.completed?p({"class":"completed"}, "Completed ", task.completed):null,
				task.initiator?p("Initiator: ", db.getPerson(task.initiator).name):null,
				task.description?div(task.description):null,
				task.jobs?templates.jobList(task.jobs):null,
				task.tasks?templates.taskList(task.tasks):null
			);
		}}
	};
	
	function addTask(prjID){
		taskEdit.view(prjID, $(".mainPanel"));
	}
	
	function addResource(prjID){
		resourceEdit.view(prjID, null, $(".mainPanel"));
	}
	
	function editTask(prjID, taskID){
		//console.log("Edit ", taskID, " in ", prjID);
		taskEdit.view(prjID, $(".mainPanel"), taskID);
	}
	
	return {
		view: function(id, pnl){
			pnl = pnl || $(".mainPanel");
			pnl.html(templates.main(db.getProject(id)));
			pnl.find(".bt_AddTask").click(function(){addTask(id);});
			pnl.find(".bt_AddResource").click(function(){addResource(id);});
			pnl.find(".bt_Edit").click(function(e){editTask(id, $(e.target).attr("taskID"));});
		}
	};
});