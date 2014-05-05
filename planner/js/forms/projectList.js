define(["html", "dataSource", "forms/projectView"], function($H, ds, projectView){
	function template(data){with($H){
		return div(ul(
			apply(data, function(prj){
				return li(a({href:"#"+prj.id}, prj.name));
			})
		));
	}}
	
	return {
		view: function(pnl){
			pnl.html(template(ds.getProjects()));
			pnl.find("a").click(function(){
				projectView.view($(this).attr("href").replace("#", ""), $(pnl));
			})
		}
	};
});