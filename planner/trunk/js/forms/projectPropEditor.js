define(["html", "db", "knockout", "util", "validation"], function($H, db, ko, util, validation){

	function template(){with($H){
		return div(
			h2("Project Properties Editor"),
			table({border:0, cellpadding:3, cellspacing:0},
				tr(th("ID"), td(input({type:"text", "data-bind":"value:$id", readonly:true}))),
				tr(th("Name"), td(input({type:"text", "data-bind":"value:$name"}), util.validMsg("$name"))),
				tr(th("Description"), td(textarea({"data-bind":"value:$description"})))
			),
			div(
				input({type:"button", value:"Cancel", "data-bind":"click:close"}), " ",
				input({type:"button", value:"Save", "data-bind":"click:save"})
			)
		);
	}}
	
	function Model(data, pnl){var _=this;
		$.extend(_,{
			$id: ko.observable(data?data.id:""),
			$name: ko.observable(data?data.name:"").extend({required:"Укажите название проекта"}),
			$description: ko.observable(data?data.description:"")
		});
		$.extend(_,{
			save: function(){
				if(!validation.validate(_)) return;
				var d = util.getModelData(this);
				db.saveProjectProperties(d);
				_.close();
			},
			close: function(){
				require("forms/projectList").view(pnl);
			}
		});
	}
	
	return {
		view: function(pnl, id){
			pnl.html(template());
			var data = db.getProjectProperties(id);
			ko.applyBindings(new Model(data, pnl), pnl.find("div")[0]);
		}
	};
});