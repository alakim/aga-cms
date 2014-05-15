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
								prj.changed?a({href:"#", "class":"selectable btSave"}, "save"):null,
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
					$(this).html("saving...");
					db.saveProject(getPrjId(this), function(){_.view(pnl);});
				}).end()
				.find(".btLoad").click(function(){
					$(this).html("loading...");
					db.loadProject(getPrjId(this), function(){_.view(pnl);});
				}).end()
				.find(".btUnload").click(function(){
					db.unloadProject(getPrjId(this), function(){_.view(pnl);});
				});
		}
	};
});