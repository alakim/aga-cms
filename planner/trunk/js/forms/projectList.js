define(["html", "db", "forms/projectView"], function($H, db, projectView){
	function template(data){with($H){
		return div(ul(
			apply(data, function(prj){
				return li(
					prj.color?{style:"color:"+prj.color}:null,
					a({href:"#"+prj.id}, prj.name)
				);
			})
		));
	}}
	
	return {
		view: function(pnl){
			pnl.html(template(db.getProjects()));
			pnl.find("a").click(function(){
				projectView.view($(this).attr("href").replace("#", ""), $(pnl));
			})
		}
	};
});