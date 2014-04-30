define(["html", "dataSource", "common"], function($H, ds, common){
	function template(data){with($H){
		return div(ul(
			apply(data, function(prj){
				return li(a({href:"#"+prj.id}, prj.name));
			})
		));
	}}
	
	return {
		view: function(pnl){
			common.wait(pnl);
			ds.getProjects(function(data){
				pnl.html(template(data));
			});
		}
	};
});