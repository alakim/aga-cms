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
							:a({href:"#", "class":"selectable btSave"}, "save")
					)
				);
			})
		));
	}}
	
	return {
		view: function(pnl){
			pnl.html(template(db.getProjects()))
				.find("span.btProject").click(function(){
					projectView.view($(this).attr("prjID"), $(pnl));
				}).end()
				.find(".btSave").click(function(){
					var prjID = $(this).parent().parent().find(".btProject").attr("prjID");
					console.log("Saving "+prjID+"...");
				}).end()
				.find(".btLoad").click(function(){
					var prjID = $(this).parent().parent().find(".btProject").attr("prjID");
					console.log("Loading "+prjID+"...");
				});
		}
	};
});