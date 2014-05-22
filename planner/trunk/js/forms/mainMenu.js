define(["jquery", "html", "knockout", "db", "dataSource", "util", "forms/projectList", "forms/queue", "forms/persons", "forms/dbView", "forms/jsonView"], function($, $H, ko, db, dSrc, util, prjList, queue, persons, dbView, jsonView){
	function template(){with($H){
		return div(
			ul({"class":"menu"},
				li({"data-bind":"click:showProjects"}, "Projects"),
				li({"data-bind":"click:showQueue"}, "Queue"),
				li({"data-bind":"click:showPersons"}, "Persons"),
				li({"data-bind":"click:showDB"}, "DB View"),
				li({"data-bind":"click:showDBJSON"}, "DB JSON View")
			),
			ul({"class":"menu"},
				li({"data-bind":"click:saveAll"}, "Save All"),
				li({"data-bind":"click:backupData"}, "Backup Data"),
				li({"data-bind":"click:clearConsole"}, "Clear Console")
			)
		);
	}}
	
	function backupLinkTemplate(backupUrl){with($H){
		return div(
			"Load last backup file: ", 
			a({href:backupUrl}, backupUrl)
		);
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
			backupData: function(){
				if(!confirm("Backup data files?"))return;
				var log = util.log("Creating backup... ");
				dSrc.backupData(function(backupUrl){
					$(".backupLinks").html(backupLinkTemplate(backupUrl));
					util.log(" DONE", log);
				});
			},
			clearConsole: function(){$("div.console").html("")},
			showDB: function(){dbView.view($(".mainPanel"))},
			showDBJSON: function(){jsonView.view($(".mainPanel"))}
		});
	}
	
	return {
		view: function(pnl){
			pnl.html(template());
			ko.applyBindings(new Model(), pnl.find("div")[0]);
		}
	};
});