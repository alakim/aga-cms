define(["html", "knockout", "forms/projectList", "forms/Queue", "forms/taskEdit"], function($H, ko, prjList, queue, taskEdit){
	function template(){with($H){
		return div(ul(
			li({"data-bind":"click:showProjects"}, "Projects"),
			li({"data-bind":"click:showQueue"}, "Queue"),
			li({"data-bind":"click:addTask"}, "Add Task")
		));
	}}
	
	function Model(){
		$.extend(this, {
			showProjects: function(){
				prjList.view($(".mainPanel"));
			},
			showQueue: function(){
				queue.view($(".mainPanel"));
			},
			addTask: function(){
				taskEdit.view($(".mainPanel"));
			}
		});
	}
	
	return {
		view: function(pnl){
			pnl.html(template());
			ko.applyBindings(new Model(), pnl.find("div")[0]);
		}
	};
});