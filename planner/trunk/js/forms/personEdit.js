define(["html", "knockout", "db", "util", "validation"], function($H, ko, db, util, validation){
	function template(data){with($H){
		return div(
			h2("Person Editor"),
			table({border:0, cellpadding:3, cellspacing:0},
				tr(th("ID"), td(templateIDField(data))),
				tr(th("ФИО"), td(input({type:"text", "data-bind":"value:$name"}), util.validMsg("$name"))),
				tr(
					td({colspan:2},
						input({type:"button", value:"Save", "data-bind":"click:save"}), " ",
						input({type:"button", value:"Cancel", "data-bind":"click:close"})
					)
				)
			)
		);
	}}
	
	function templateIDField(data){with($H){
		return markup(
			data?input({type:"text", readonly:true, "data-bind":"value:$id"})
				:markup(input({type:"text", "data-bind":"value:$id"}), util.validMsg("$id"))
		);
	}}
	
	function Model(data, pnl){var _=this;
		$.extend(_,{
			$id: ko.observable(data?data.id:"").extend({uniqueID:"persons"}),
			$name: ko.observable(data?data.name:"").extend({required:"Укажите ФИО"})
		});
		$.extend(_,{
			save: function(){
				if(!validation.validate(_)) return;
				var d = util.getModelData(this);
				db.savePerson(d);
				_.close();
			},
			close: function(){
				if(data)
					require("forms/personView").view(pnl, data.id);
				else
					require("forms/persons").view(pnl);
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