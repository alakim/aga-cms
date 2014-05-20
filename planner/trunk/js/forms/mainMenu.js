define(["jquery", "html", "knockout", "db", "forms/projectList", "forms/queue", "forms/persons", "forms/dbView"], function($, $H, ko, db, prjList, queue, persons, dbView){
	function template(){with($H){
		return div(ul({"class":"menu"},
			li({"data-bind":"click:showProjects"}, "Projects"),
			li({"data-bind":"click:showQueue"}, "Queue"),
			li({"data-bind":"click:showPersons"}, "Persons"),
			li({"data-bind":"click:saveAll"}, "Save All"),
			li({"data-bind":"click:clearConsole"}, "Clear Console"),
			li({"data-bind":"click:showDB"}, "DB View")
		));
	}}
	
	function Model(){
		$.extend(this, {
			showProjects: function(){prjList.view($(".mainPanel"));},
			showQueue: function(){queue.view($(".mainPanel"));},
			showPersons: function(){persons.view($(".mainPanel"));},
			saveAll: function(){
				if(!confirm("Save All Data?"))return;
				db.saveAll();
			},
			clearConsole: function(){$("div.console").html("")},
			showDB: function(){dbView.view($(".mainPanel"))}
		});
	}
	
	return {
		view: function(pnl){
			pnl.html(template());
			ko.applyBindings(new Model(), pnl.find("div")[0]);
		}
	};
});