define(["html", "db", "forms/taskView", "forms/personEdit"], function($H, db, taskView, editor){
	function template(data, refs){with($H){
		return div(
			p(span({style:"font-weight:bold;"}, "ID: "), data.id),
			p(span({style:"font-weight:bold;"}, "ФИО: "), data.name),
			div({"class":"menu"},
				a({href:"#", "class":"btEdit"}, "Edit")
			),
			div(
				h3("Initiating Tasks"),
				ul(
					apply(refs.tasksInitialized, function(tID){
						var task = db.getTask(tID),
							prj = db.getProject(db.getTaskProject(tID));
						return li(a({href:"#", "class":"lnkTask", taskID:task.id}, task.name, format(" [{0}]", prj.name)));
					})
				)
			)
			//p("Contains all reffered items, links to edit forms, etc.")
		);
	}}
	
	
	return {
		view: function(pnl, prsID){
			var data = db.getPerson(prsID),
				refs = db.getPersonRefs(prsID);
			pnl.html(template(data, refs))
				.find("a.lnkTask").click(function(){
					var taskID = $(this).attr("taskID");
					taskView.view(taskID, pnl);
				}).end()
				.find("a.btEdit").click(function(){
					editor.view(pnl, prsID);
				});
		}
	};
});