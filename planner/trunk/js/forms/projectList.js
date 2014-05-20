define(["html", "db", "forms/projectView", "forms/projectEditor"], function($H, db, projectView, projectEditor){
	function template(data){with($H){
		return div(
			h2("Projects List"),
			ul(
				apply(data, function(prj){
					return li(
						prj.color?{style:"color:"+prj.color}:null,
						span({style:"float:left; width:200px;"},
							prj.frozen?span({"class":"frozen btProject", prjID:prj.id}, prj.name)
								:span({"class":"selectable btProject", prjID:prj.id}, prj.name)
						),
						div({style:"float:left; display:inline;"},
							prj.frozen?a({href:"#", "class":"selectable btLoad", style:"padding-left:50px;"}, "load")
								:markup(
									prj.changed?a({href:"#", "class":"selectable btSave"}, "save"):null,
									a({href:"#", "class":"selectable btUnload", style:"padding-left:50px;"}, "unload")
								)
						),
						span({style:"float:left; margin-left:80px;"},
							a({href:"#", "class":"btEdit", prjID:prj.id}, "edit")
						)
					);
				})
			),
			ul({"class":"menu"},
				li(a({href:"#", "class":"btAdd"}, "Add"))
			)
		);
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
				}).end()
				.find(".btAdd").click(function(){
					projectEditor.view(pnl);
				}).end()
				.find(".btEdit").click(function(){
					projectEditor.view(pnl, $(this).attr("prjID"));
				});
		}
	};
});