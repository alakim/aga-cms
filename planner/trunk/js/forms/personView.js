define(["html", "db", "forms/taskView", "forms/personEdit"], function($H, db, taskView, editor){
	var templates = {
		main: function(data, refs){with($H){
			var hdrStyle = {style:"font-weight:bold;"};
			return div(
				h2("Person"),
				p(span(hdrStyle, "ID: "), data.id),
				p(span(hdrStyle, "ФИО: "), data.name),
				templates.optionalField(data, "Phone", "phone"),
				templates.optionalField(data, "E-Mail", "email", "mailto:"),
				templates.optionalField(data, "Web Site", "site", "http://"),
				templates.optionalField(data, "Address", "address"),
				templates.optionalField(data, "Description", "description"),
				div({"class":"menu"},
					a({href:"#", "class":"btEdit"}, "Edit")
				),
				templates.taskList(refs.tasksInitialized, "Initiating Tasks"),
				templates.taskList(refs.tasksExecuted, "Executing Tasks"),
				templates.resourcesRefs(refs.resources)
			);
		}},
		resourcesRefs: function(coll){with($H){
			return div(
				h3("Resource of projects"),
				ul(
					apply(coll, function(ref){
						ref = ref.split("/");
						var prj = db.getProject(ref[0]);
						return li(a({href:"#", "class":"lnkProject", prjID:prj.id}, prj.name));
					})
				)
			);
		}},
		taskList: function(coll, title){with($H){
			return coll&&coll.length?div(
				h3(title),
				ul(
					apply(coll, function(tID){
						var task = db.getTask(tID),
							prj = db.getProject(db.getTaskProject(tID));
						return li(a({href:"#", "class":"lnkTask", taskID:task.id}, prj.name, "/", task.name));
					})
				)
			):null;
		}},
		optionalField: function(data, title, name, linkPrefix){with($H){
			linkPrefix = linkPrefix || false;
			var val = data[name];
			return val&&val.length?p(span({style:"font-weight:bold;"}, title+": "), linkPrefix?a({href:linkPrefix+val}, val):val):null;
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
				}).end()
				.find("a.lnkProject").click(function(){
					var prjID = $(this).attr("prjID");
					require("forms/projectView").view(prjID, pnl);
				});
		}
	};
});