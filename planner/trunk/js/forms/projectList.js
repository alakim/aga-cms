define(["html", "jspath", "db", "forms/projectView", "forms/projectEditor"], function($H, $JP, db, projectView, projectEditor){
	function template(data){with($H){
		var groups = [],
			grpProjects = {};
		$.each(data, function(i, prj){
			if(!prj.priority) prj.priority = 0;
			$JP.set(grpProjects, [prj.group || "", "#*"], prj);
		});
		for(var grp in grpProjects){
			groups.push(grp);
			grpProjects[grp].sort(function(p1, p2){
				var pr1 = +p1.priority,
					pr2 = +p2.priority;
				return pr1==pr2?0:pr1<pr2?1:-1;
			});
		}
		groups.sort();
		return div(
			h2("Projects List"),
			apply(groups, function(grp){
				return div(
					div(grp),
					ul(
						apply(grpProjects[grp], function(prj){
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
						
					)
				);
			}),
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