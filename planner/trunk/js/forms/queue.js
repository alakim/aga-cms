define(["html", "db", "forms/taskView"], function($H, db, taskView){
	function template(data){with($H){
		return div(
			h2("Queue"),
			ol(
				apply(data, function(itm){
					var prj = db.getProject(db.getTaskProject(itm.id));
					return li(a({href:"#"+itm.id}, itm.name, format(" [{0}]", prj.name)));
				})
			)
		);
	}}
	
	return {
		view: function(pnl){
			pnl.html(template(db.getQueue()));
			pnl.find("a").click(function(){
				taskView.view($(this).attr("href").replace("#", ""), $(pnl));
			})
		}
	};
});