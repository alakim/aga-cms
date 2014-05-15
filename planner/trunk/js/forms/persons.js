define(["html", "db", "forms/personView"], function($H, db, personView){
	function template(data){with($H){
		return div(ol(
			apply(data, function(prs){
				var refCount = getRefCount(prs.id);
				return li(
					a({href:"#", "class":"selectable btView", prsID:prs.id}, prs.name),
					format(" [{0}]", prs.id),
					refCount?span({style:"font-style:italic; color:#ccc;"}, format(" referred by {0} items", refCount))
						:a({href:"#", "class":"btDel", style:"margin-left:240px;", prsID:prs.id}, "delete")
				);
			})
		));
	}}
	
	function getRefCount(prsID){
		return db.getPersonRefs(prsID).tasksInitialized.length;
	}
	
	return {
		view: function(pnl){
			pnl.html(template(db.getPersons()))
				.find(".btDel").click(function(){
					var prsID = $(this).attr("prsID");
					if(confirm("Delete person "+prsID+"? (NOT RECOMMENDED)"))
						console.log(prsID+" DELETED");
				}).end()
				.find(".btView").click(function(){
					personView.view(pnl, $(this).attr("prsID"));
				});
		}
	};
});