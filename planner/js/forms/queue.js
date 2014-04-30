define(["html", "dataSource", "common"], function($H, ds, common){
	function template(data){with($H){
		return div(ul(
			apply(data, function(itm){
				return li(itm.name);
			})
		));
	}}
	
	return {
		view: function(pnl){
			common.wait(pnl);
			ds.getQueue(function(data){
				pnl.html(template(data));
			});
		}
	};
});