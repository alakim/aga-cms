define(["html", "db", "forms/personView", "forms/personEdit"], function($H, db, personView, editor){
	function template(data){with($H){
		return div(
			ol(
				apply(data, function(prs){
					var refCount = getRefCount(prs.id);
					return li(
						a({href:"#", "class":"selectable btView", prsID:prs.id}, prs.name),
						format(" [{0}]", prs.id),
						refCount?span({style:"font-style:italic; color:#ccc;"}, format(" referred by {0} items", refCount))
							:a({href:"#", "class":"btDel", style:"margin-left:240px;", prsID:prs.id}, "delete")
					);
				})
			),
			ul({"class":"menu"},
				li(a({href:"#", "class":"btAdd"}, "Add"))
			)
		);
	}}
	
	function getRefCount(prsID){
		return db.getPersonRefs(prsID).tasksInitialized.length;
	}
	
	return {
		view: function(pnl){var _=this;
			pnl.html(template(db.getPersons()))
				.find(".btDel").click(function(){
					var prsID = $(this).attr("prsID");
					if(confirm("Delete person "+prsID+"? (NOT RECOMMENDED)")){
						db.deletePerson(prsID);
						_.view(pnl);
					}
				}).end()
				.find(".btView").click(function(){
					personView.view(pnl, $(this).attr("prsID"));
				}).end()
				.find(".btAdd").click(function(){
					editor.view(pnl);
				});
		}
	};
});