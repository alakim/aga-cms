define(["html", "db", "forms/taskEdit"], function($H, db, taskEdit){
	function taskJobListTemplate(jobList){with($H){
		return ul(
			apply(jobList, function(job){
				return li(
					job.date, ": ", job.hours, "h",
					job.notes?markup(" - ", job.notes):null
				);
			})
		);
	}}
	
	function taskTemplate(task){with($H){
		return div({"class":"task"},
			h3(
				task.name, 
				task.id?span(" (", task.id,")"):null
				//   ," pos:", db.getTaskPosition(task.id)
			),
			div({style:"text-align:right; margin-right:300px;"},
				span({"class":"menu bt_Edit", taskID:task.id}, "Edit")
			),
			task.completed?p({"class":"completed"}, "Completed ", task.completed):null,
			task.initiator?p("Initiator: ", db.getPerson(task.initiator).name):null,
			task.description?div(task.description):null,
			task.jobs?taskJobListTemplate(task.jobs):null,
			task.tasks?taskListTemplate(task.tasks):null
		);
	}}
	
	function taskListTemplate(taskList){with($H){
		if(!taskList || taskList.length==0) return;
		return div({"class":"taskList"},
			apply(taskList, function(task, i){
				return taskTemplate(task);
			})
		)
	}}
	
	function template(prj){with($H){
		return div(
			h2(
				prj.color?{style:"color:"+prj.color}:null,
				prj.name, " (", prj.id,")"
			),
			menuTemplate(prj),
			taskListTemplate(prj.tasks)
		);
	}}
	
	function menuTemplate(prj){with($H){
		return ul({"class":"menu"},
			li({"class":"bt_AddTask"}, "Add Task")
		);
	}}
	
	function addTask(prjID){
		taskEdit.view(prjID, $(".mainPanel"));
	}
	
	function editTask(prjID, taskID){
		//console.log("Edit ", taskID, " in ", prjID);
		taskEdit.view(prjID, $(".mainPanel"), taskID);
	}
	
	return {
		view: function(id, pnl){
			pnl = pnl || $(".mainPanel");
			pnl.html(template(db.getProject(id)));
			pnl.find(".bt_AddTask").click(function(){addTask(id);});
			pnl.find(".bt_Edit").click(function(e){editTask(id, $(e.target).attr("taskID"));});
		}
	};
});