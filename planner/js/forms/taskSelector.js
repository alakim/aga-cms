define(["html", "dataSource"], function($H, ds){
	
	function template(prj){with($H){
		return div(
			div(prj.name),
			taskListTemplate(prj.tasks)
		);
	}}
	
	function taskListTemplate(list){with($H){
		return ul(
			apply(list, function(task){
				return li(task.name, " (", task.id,")",
					task.tasks?taskListTemplate(task.tasks):null
				);
			})
		);
	}}
	
	return {
		view: function(prjID, onSelect){
			var pnl = $("#taskSelector");
			pnl.hide().html(template(ds.getProject(prjID))).slideDown();
			pnl.find("th").attr({align:"right"});
		}
	};
});