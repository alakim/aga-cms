define(["jquery", "html", "knockout", "dataSource"], function($, $H, ko, ds){
	
	function template(prj){with($H){
		return div(
			div({"class":"selectable", "data-bind":"click:select"}, prj.name),
			taskListTemplate(prj.tasks)
		);
	}}
	
	function taskListTemplate(list){with($H){
		return ul(
			apply(list, function(task){
				return li(
					span({"class":"selectable", "data-bind":"click:select", taskID:task.id},
						task.name,
						format(" ({0})", task.id)
					), 
					task.tasks?taskListTemplate(task.tasks):null
				);
			})
		);
	}}
	
	function Model(onSelect){
		$.extend(this, {
			select: function(mod, e){
				mod.onSelect($(e.target).attr("taskID"));
				this.close();
			},
			onSelect: onSelect,
			close: function(){
				$("#taskSelector").slideUp().html("");
			}
		});
	}
	
	return {
		view: function(prjID, onSelect){
			var pnl = $("#taskSelector");
			pnl.hide().html(template(ds.getProject(prjID))).slideDown();
			pnl.find("th").attr({align:"right"});
			ko.applyBindings(new Model(onSelect), pnl.find("div")[0]);
		}
	};
});