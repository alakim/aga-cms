define(["html", "dataSource"], function($H, ds){
	function taskJobListTemplate(jobList){with($H){
		return ul(
			apply(jobList, function(job){
				return li(job.date, ": ", job.hours, "h");
			})
		);
	}}
	
	function taskTemplate(task){with($H){
		return div({"class":"task"},
			h3(task.name, task.id?span(" (", task.id,")"):null),
			task.completed?p({"class":"completed"}, "Completed ", task.completed):null,
			task.initiator?p("Initiator: ", ds.getPerson(task.initiator).name):null,
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
			taskListTemplate(prj.tasks)
		);
	}}
	
	return {
		view: function(id, pnl){
			pnl.html(template(ds.getProject(id)));
		}
	};
});