define(["html", "knockout", "forms/projectList", "forms/Queue"], function($H, ko, prjList, queue){
	function template(){with($H){
		return div(ul(
			li({"data-bind":"click:showProjects"}, "Projects"),
			li({"data-bind":"click:showQueue"}, "Queue")
		));
	}}
	
	function Model(){
		this.showProjects = function(){
			prjList.view($(".mainPanel"));
		}
		this.showQueue = function(){
			queue.view($(".mainPanel"));
		}
	}
	
	return {
		view: function(pnl){
			pnl.html(template());
			ko.applyBindings(new Model(), pnl.find("div")[0]);
		}
	};
});