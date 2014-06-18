define(["html", "knockout", "db", "util", "validation"], function($H, ko, db, util, validation){
	function template(data){with($H){
		return div(
			h2("Person Editor"),
			table({border:0, cellpadding:3, cellspacing:0},
				tr(th("ID"), td(templateIDField(data))),
				tr(th("ФИО"), td(input({type:"text", "data-bind":"value:$name"}), util.validMsg("$name"))),
				tr(th("Phone"), td(input({type:"text", "data-bind":"value:$phone"}))),
				tr(th("E-Mail"), td(input({type:"text", "data-bind":"value:$email"}))),
				tr(th("Web Site"), td(input({type:"text", "data-bind":"value:$site"}))),
				tr(th("Address"), td(input({type:"text", "data-bind":"value:$address"}))),
				tr(th("Description"), td(textarea({"data-bind":"value:$description", style:"width:350px; height:180px;"}))),
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
	
	function idModel(data){
		var m = ko.observable(data?data.id:"");
		if(!data) m.extend({uniqueID:"persons"});
		return m;
	}
	
	function Model(data, pnl){var _=this;
		$.extend(_,{
			$id: idModel(data),
			$name: ko.observable(data?data.name:"").extend({required:"Укажите ФИО"}),
			$phone: ko.observable(data?data.phone:""),
			$email: ko.observable(data?data.email:""),
			$site: ko.observable(data?data.site:""),
			$address: ko.observable(data?data.address:""),
			$description: ko.observable(data?data.description:"")
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