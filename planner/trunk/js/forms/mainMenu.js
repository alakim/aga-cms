define(["html", "knockout", "forms/projectList", "forms/Queue"], function($H, ko, prjList, queue){
	function template(){with($H){
		return div(ul({"class":"menu"},
			li({"data-bind":"click:showProjects"}, "Projects"),
			li({"data-bind":"click:showQueue"}, "Queue")
		));
	}}
	
	function Model(){
		$.extend(this, {
			showProjects: function(){
				prjList.view($(".mainPanel"));
			},
			showQueue: function(){
				queue.view($(".mainPanel"));
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