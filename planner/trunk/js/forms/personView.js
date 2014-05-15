define(["html", "db"], function($H, db){
	function template(data){with($H){
		return div(
			h2("COMPLETE PERSON VIEW of ", data.id),
			p("ФИО: ", data.name),
			p("Contains all reffered items, links to edit forms, etc.")
		);
	}}
	
	
	return {
		view: function(pnl, prsID){
			var data = db.getPerson(prsID);
			pnl.html(template(data));
		}
	};
});