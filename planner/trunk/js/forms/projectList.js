define(["html", "db", "forms/projectView"], function($H, db, projectView){
	function template(data){with($H){
		return div(ul(
			apply(data, function(prj){
				return li(
					prj.color?{style:"color:"+prj.color}:null,
					span({style:"float:left; width:200px;"},
						prj.frozen?span({"class":"frozen btProject", prjID:prj.id}, prj.name)
							:span({"class":"selectable btProject", prjID:prj.id}, prj.name)
					),
					div({style:"display:inline;"},
						prj.frozen?a({href:"#", "class":"selectable btLoad", style:"padding-left:50px;"}, "load")
							:markup(
								a({href:"#", "class":"selectable btSave"}, "save"),
								a({href:"#", "class":"selectable btUnload", style:"padding-left:50px;"}, "unload")
							)
					)
				);
			})
		));
	}}
	
	return {
		view: function(pnl){var _=this;
			function getPrjId(btn){
				return $(btn).parent().parent().find(".btProject").attr("prjID");
			}
			pnl.html(template(db.getProjects()))
				.find("span.btProject").click(function(){
					projectView.view($(this).attr("prjID"), $(pnl));
				}).end()
				.find(".btSave").click(function(){
					var prjID = getPrjId(this);
					console.log("Saving "+prjID+"...");
				}).end()
				.find(".btLoad").click(function(){
					var prjID = getPrjId(this);
					db.loadProject(prjID, function(){
						_.view(pnl);
					});
				}).end()
				.find(".btUnload").click(function(){
					var prjID = getPrjId(this);
					db.unloadProject(prjID, function(){
						_.view(pnl);
					});
				});
		}
	};
});