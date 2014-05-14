define(["html", "db", "forms/taskView"], function($H, db, taskView){
	function template(data){with($H){
		return div(ol(
			apply(data, function(itm){
				return li(a({href:"#"+itm.id}, itm.name));
			})
		));
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