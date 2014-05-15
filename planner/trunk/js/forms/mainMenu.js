define(["html", "knockout", "forms/projectList", "forms/Queue", "forms/persons"], function($H, ko, prjList, queue, persons){
	function template(){with($H){
		return div(ul({"class":"menu"},
			li({"data-bind":"click:showProjects"}, "Projects"),
			li({"data-bind":"click:showQueue"}, "Queue"),
			li({"data-bind":"click:showPersons"}, "Persons")
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
			showPersons: function(){
				persons.view($(".mainPanel"));
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