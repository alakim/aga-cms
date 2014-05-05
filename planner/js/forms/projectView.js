define(["html", "dataSource"], function($H, ds){
	function taskTemplate(task){with($H){
		return div({"class":"task"},
			h3(task.name),
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
	
	function template(data){with($H){
		return div(
			h2("Project ", data.name, "(", data.id,")"),
			taskListTemplate(data.tasks)
		);
	}}
	
	return {
		view: function(id, pnl){
			pnl.html(template(ds.getProject(id)));
		}
	};
});