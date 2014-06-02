define(["html", "db", "forms/taskView"], function($H, db, taskView){
	function template(data){with($H){
		var list = [];
		for(var k in data){var el = data[k];
			list.push({
				id:k,
				date: el.date,
				name: el.name,
				prj: el.prj
			});
		}
		list.sort(function(d1, d2){
			return d1.date==d2.date?0:d1.date>d2.date?1:-1;
		});
		return div(
			h2("Deadlines"),
			ol(
				apply(list, function(ddl){
					var prj = db.getRegistryItem(ddl.prj);
					return li(
						!prj? span(ddl.date, " ", ddl.name)
							:prj.frozen? span(ddl.date, " ", prj.name, "/", ddl.name)
							:a({href:"#", "class":"lnkTask", taskID:ddl.id}, ddl.date, " ", prj.name, "/", ddl.name)
					)
				})
			)
		);
	}}
	
	var mainPanel;
	
	function viewTask(){
		var taskID = $(this).attr("taskID");
		taskView.view(taskID, mainPanel);
	}
	
	return {
		view: function(pnl){var _=this;
			mainPanel = pnl;
			pnl.html(template(db.getDeadlines()));
			pnl.find(".lnkTask").click(viewTask);
		}
	};
});