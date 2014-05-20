define(["html", "knockout", "db", "util", "validation"], function($H, ko, db, util, validation){
	var templates = {
		main: function(data){with($H){
			return div(
				h2("Resource Editor"),
				table({border:0, cellpadding:3, cellspacing:0},
					tr(th("ID"), td(templates.idField(data))),
					tr(th("Type"), td(templates.typeField(data))),
					tr(th("Name"), td(input({type:"text", "data-bind":"value:$name"}), util.validMsg("$name"))),
					tr(
						td({colspan:2},
							input({type:"button", value:"Save", "data-bind":"click:save"}), " ",
							input({type:"button", value:"Cancel", "data-bind":"click:close"})
						)
					)
				)
			)
		}},
		typeField: function(data){with($H){
			return markup(
				select({"data-bind":"value:$type"},
					option({value:"site"}, "Site"),
					option({value:"person"}, "Person")
				),
				util.validMsg("$type")
			);
		}},
		idField: function(data){with($H){
			var attr = {type:"text", "data-bind":"value:$id"};
			return markup(
				input(attr),
				util.validMsg("$id")
			);
		}}
	};
	
	

	
	function Model(data, prjID, pnl){var _=this;
		$.extend(_,{
			$id: ko.observable(data?data.id:"").extend({uniqueID:"projects/"+prjID+"/resources"}),
			$type: ko.observable(data?data.type:"").extend({required:"Выберите тип ресурса"}),
			$name: ko.observable(data?data.name:"").extend({required:"Укажите название ресурса"}),
			$description: ko.observable(data?data.description:"")
		});
		$.extend(_,{
			save: function(){
				if(!validation.validate(_)) return;
				var d = util.getModelData(this);
				// db.savePerson(d);
				_.close();
			},
			close: function(){
				require("forms/projectView").view(prjID, pnl);
			}
		});
	}
	
	return {
		view: function(prjID, resID, pnl){
			var data = resID?db.getResource(prjID, resID):null;
			pnl.html(templates.main(data));
			ko.applyBindings(new Model(data, prjID, pnl), pnl.find("div")[0]);
		}
	};
});