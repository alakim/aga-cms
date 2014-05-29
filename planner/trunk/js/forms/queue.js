define(["html", "db", "forms/taskView"], function($H, db, taskView){
	function template(data){with($H){
		return div(
			h2("Queue"),
			ol(
				apply(data, function(itm){
					var prjID = db.getTaskProject(itm.id),
						prj = db.getProject(prjID);
					return li(
						prj?a({href:"#"+itm.id}, itm.name, format(" [{0}]", prj.name))
							:span({style:"color:#ccc;"}, itm.id)
					);
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