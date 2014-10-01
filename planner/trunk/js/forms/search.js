define(["html", "db", "forms/taskView"], function($H, db, taskView){
	
	var templates = {
		main: function(){with($H){
			return div(
				h2("Search"),
				input({type:"text", style:"width:250px;", "class":"tbSearch"}),
				input({type:"button", value:"Search", "class":"btSearch"}),
				div({"class":"searchResPnl"})
			);
		}},
		report: function(data){with($H){
			if(!data || !data.length) return div("Nothing found.");
			
			return ol(
				apply(data, function(itm){
					var prjID = db.getTaskProject(itm.id),
						prj = db.getProject(prjID);
					return li(
						prj?a({href:"#"+itm.id}, itm.name, format(" [{0}]", prj.name))
							:span({style:"color:#ccc;"}, itm.id)
					);
				})
			)
		}}
	}
	
	var pnl, resPnl, searchField;
	
	function doSearch(){
		var sstr = searchField.val();
		var data = db.search(sstr);
		resPnl.html(templates.report(data));
		
		resPnl.find("a").click(function(){
			taskView.view($(this).attr("href").replace("#", ""), $(pnl));
		});
	}
	
	
	return {
		view: function(viewPnl){var _=this;
			pnl = viewPnl;
			pnl.html(templates.main());
			pnl.find(".btSearch").click(doSearch);
			resPnl = pnl.find(".searchResPnl");
			searchField = pnl.find(".tbSearch");
		}
	};
});