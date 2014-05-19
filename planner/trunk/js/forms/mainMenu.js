define(["jquery", "html", "knockout", "db", "forms/projectList", "forms/Queue", "forms/persons"], function($, $H, ko, db, prjList, queue, persons){
	function template(){with($H){
		return div(ul({"class":"menu"},
			li({"data-bind":"click:showProjects"}, "Projects"),
			li({"data-bind":"click:showQueue"}, "Queue"),
			li({"data-bind":"click:showPersons"}, "Persons"),
			li({"data-bind":"click:saveAll"}, "Save All"),
			li({"data-bind":"click:clearConsole"}, "Clear Console")
		));
	}}
	
	function Model(){
		$.extend(this, {
			showProjects: function(){prjList.view($(".mainPanel"));},
			showQueue: function(){queue.view($(".mainPanel"));},
			showPersons: function(){persons.view($(".mainPanel"));},
			saveAll: function(){db.saveAll();},
			clearConsole: function(){$("div.console").html("")}
		});
	}
	
	return {
		view: function(pnl){
			pnl.html(template());
			ko.applyBindings(new Model(), pnl.find("div")[0]);
		}
	};
});