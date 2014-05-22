define(["html", "db", "forms/taskEdit", "forms/taskView", "forms/resourceEdit", "forms/personView"], function($H, db, taskEdit, taskView, resourceEdit, personView){

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
				//h4("Tasks"),
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
				span({style:"font-weight:bold;"}, id, ": "), data.name, " ",
				data.type=="site"?a({href:data.url}, data.title)
					:data.type=="person"?span({"class":"selectable lnkPerson", prsID:""}, "")
					:null,
				span({"class":"selectable btEditRes", resID:data.id, style:"padding-left:25px;"}, "Edit")
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
		personRef: function(prsID){with($H){
			return span({"class":"selectable lnkPerson", prsID:prsID},
				db.getPerson(prsID).name
			);
		}},
		task: function(task){with($H){
			var qPos = db.getQueuePosition(task.id);
			return div({"class":"task"},
				h3(task.completed?{"class":"completed"}:null,
					task.name, 
					task.id?span(" (", task.id,")"):null
					//   ," pos:", db.getTaskPosition(task.id)
				),
				div({"class":"properties"},
					qPos!=null?span({"class":"queuePos"}, qPos+1, " in queue"):null,
					task.date?span({"class":"date"}, task.date):null,
					task.initiator?span(span({"class":"paramName"}, " Initiator: "), templates.personRef(task.initiator)):null,
					task.executor?span(span({"class":"paramName"}, " Executor: "), templates.personRef(task.executor)):null,
					task.completed?span({"class":"completed"}, "Completed ", task.completed):null
				),
				div({style:"margin:5px;"},
					span({"class":"menu bt_View", taskID:task.id}, "View"), " ",
					span({"class":"menu bt_Edit", taskID:task.id}, "Edit")
				),
				task.completed?null:div(
					task.description?div(task.description):null,
					task.jobs?templates.jobList(task.jobs):null
				),
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

	function viewTask(prjID, taskID){
		taskView.view(taskID, $(".mainPanel"));
	}
	function viewPerson(prsID){
		personView.view($(".mainPanel"), prsID);
	}
	
	function editResource(prjID, resID){
		resourceEdit.view(prjID, resID, $(".mainPanel"));
	}
	
	return {
		view: function(id, pnl){
			pnl = pnl || $(".mainPanel");
			pnl.html(templates.main(db.getProject(id)));
			pnl.find(".bt_AddTask").click(function(){addTask(id);});
			pnl.find(".bt_AddResource").click(function(){addResource(id);});
			pnl.find(".bt_View").click(function(e){viewTask(id, $(e.target).attr("taskID"));});
			pnl.find(".bt_Edit").click(function(e){editTask(id, $(e.target).attr("taskID"));});
			pnl.find(".lnkPerson").click(function(e){viewPerson($(e.target).attr("prsID"));});
			pnl.find(".btEditRes").click(function(e){editResource(id, $(e.target).attr("resID"));});
		}
	};
});