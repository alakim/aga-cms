define(["html", "db", "util", "forms/taskView"], function($H, db, util, taskView){
	function template(data){with($H){
		var list = [];
		for(var k in data){var el = data[k];
			list.push({
				id:k,
				date: el.date,
				name: el.name,
				path: el.path,
				prj: el.prj
			});
		}
		var now = new Date(), week = 7*24*60*60*1000, nowT = now.getTime();
		var weekAgo = new Date(); weekAgo.setTime(nowT+week);
		var week2Ago = new Date(); week2Ago.setTime(nowT+week*2);
		var week3Ago = new Date(); week3Ago.setTime(nowT+week*3);
		var week4Ago = new Date(); week4Ago.setTime(nowT+week*4);
		
		list.push({date: util.formatDate(now), name:"**** NOW ****"});
		list.push({date: util.formatDate(weekAgo), name:"**** 1 week ago ****"});
		list.push({date: util.formatDate(week2Ago), name:"**** 2 weeks ago ****"});
		list.push({date: util.formatDate(week3Ago), name:"**** 3 weeks ago ****"});
		list.push({date: util.formatDate(week4Ago), name:"**** 4 weeks ago ****"});
		
		list.sort(function(d1, d2){
			return d1.date==d2.date?0:d1.date>d2.date?1:-1;
		});
		return div(
			h2("Deadlines"),
			ul(
				apply(list, function(ddl){
					var prj = db.getRegistryItem(ddl.prj);
					return li(
						!ddl.id?span({style:"color:#f00;"}, ddl.date, " ", ddl.name)
							:!prj? span(ddl.date, " ", ddl.name)
							:prj.frozen? span(ddl.date, " ", ddl.path || (prj.name+"/"+ddl.name))
							:a({href:"#", "class":"lnkTask", taskID:ddl.id}, ddl.date, " ", ddl.path || (prj.name+"/"+ddl.name))
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