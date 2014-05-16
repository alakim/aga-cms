define(["html", "knockout", "db", "util"], function($H, ko, db, util){
	function template(data){with($H){
		return div(
			h2("Person Editor"),
			table({border:0, cellpadding:3, cellspacing:0},
				tr(th("ID"), td(input({type:"text", "data-bind":"value:$id"}))),
				tr(th("ФИО"), td(input({type:"text", "data-bind":"value:$name"}))),
				tr(
					td({colspan:2},
						input({type:"button", value:"Save", "data-bind":"click:save"}), " ",
						input({type:"button", value:"Cancel", "data-bind":"click:close"})
					)
				)
			)
		);
	}}
	
	function Model(data, pnl){var _=this;
		$.extend(_,{
			$id: ko.observable(data.id),
			$name: ko.observable(data.name).extend({required:"Укажите ФИО"})
		});
		$.extend(_,{
			save: function(){
				var d = util.getModelData(this);
				db.savePerson(d);
				_.close();
			},
			close: function(){
				require("forms/personView").view(pnl, data.id);
			}
		});
	}
	
	return {
		view: function(pnl, prsID){
			var data = db.getPerson(prsID);
			pnl.html(template(data));
			ko.applyBindings(new Model(data, pnl), pnl.find("div")[0]);
		}
	};
});