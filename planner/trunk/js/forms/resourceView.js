define(["html", "knockout", "db", "util", "validation", "forms/personView"], function($H, ko, db, util, validation, personView){
	var templates = {
		main: function(data){with($H){
			return div(
				h2("Resource View"),
				table({border:0, cellpadding:3, cellspacing:0},
					tr(th("ID"), td(data.id)),
					tr(th("Type"), td(data.type)),
					tr(th("Name"), td(data.name)),
					tr(th("Description"), td(data.description)),
					data.type=="site"?tr(th("URL"), td(a({href:data.url}, data.url)))
						:data.type=="person"?tr(th("Person"), td(templates.personName(data.personID)))
						:null,
					tr(
						td({colspan:2},
							input({type:"button", value:"Close", "class":"btClose"})
						)
					)
				)
			)
		}},
		personName: function(id){with($H){
			var prs = db.getPerson(id);
			return a({href:"#", "class":"lnkPerson", personID:prs.id}, prs.name);
		}}
	};

	var mainPanel, projectID;
	
	function showPerson(){
		var personID = $(this).attr("personID");
		personView.view(mainPanel, personID);
	}
	function closeWin(){
		require("forms/projectView").view(projectID, mainPanel);
	}
	
	return {
		view: function(prjID, resID, pnl){
			mainPanel = pnl;
			projectID = prjID;
			var data = resID?db.getResource(prjID, resID):null;
			pnl.html(templates.main(data));
			pnl.find(".lnkPerson").click(showPerson);
			pnl.find(".btClose").click(closeWin);
		}
	};
});