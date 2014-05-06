﻿define(["html", "dataSource", "forms/taskView"], function($H, ds, taskView){
	function template(data){with($H){
		return div(ul(
			apply(data, function(itm){
				return li(a({href:"#"+itm.id}, itm.name));
			})
		));
	}}
	
	return {
		view: function(pnl){
			pnl.html(template(ds.getQueue()));
			pnl.find("a").click(function(){
				taskView.view($(this).attr("href").replace("#", ""), $(pnl));
			})
		}
	};
});