define(["html", "db", "forms/taskView", "forms/personEdit"], function($H, db, taskView, editor){
	var templates = {
		main: function(data, refs){with($H){
			var hdrStyle = {style:"font-weight:bold;"};
			return div(
				h2("Person"),
				p(span(hdrStyle, "ID: "), data.id),
				p(span(hdrStyle, "ФИО: "), data.name),
				templates.optionalField(data, "Phone", "phone"),
				templates.optionalField(data, "E-Mail", "email"),
				templates.optionalField(data, "Address", "address"),
				templates.optionalField(data, "Description", "description"),
				div({"class":"menu"},
					a({href:"#", "class":"btEdit"}, "Edit")
				),
				templates.taskList(refs.tasksInitialized, "Initiating Tasks"),
				templates.taskList(refs.tasksExecuted, "Executing Tasks")
			);
		}},
		taskList: function(coll, title){with($H){
			return coll&&coll.length?div(
				h3(title),
				ul(
					apply(coll, function(tID){
						var task = db.getTask(tID),
							prj = db.getProject(db.getTaskProject(tID));
						return li(a({href:"#", "class":"lnkTask", taskID:task.id}, task.name, format(" [{0}]", prj.name)));
					})
				)
			):null;
		}},
		optionalField: function(data, title, name){with($H){
			var val = data[name];
			return val&&val.length?p(span({style:"font-weight:bold;"}, title+": "), val):null;
		}}
	};
	
	
	
	return {
		view: function(pnl, prsID){
			var data = db.getPerson(prsID),
				refs = db.getPersonRefs(prsID);
			pnl.html(templates.main(data, refs))
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