define(["html", "db", "knockout", "util", "validation"], function($H, db, ko, util, validation){

	function template(){with($H){
		return div(
			h2("Project Editor"),
			table({border:0, cellpadding:3, cellspacing:0},
				tr(th("ID"), td(input({type:"text", "data-bind":"value:$id"}), util.validMsg("$id"))),
				tr(th("Name"), td(input({type:"text", "data-bind":"value:$name"}), util.validMsg("$name"))),
				tr(th("Color"), td(input({type:"text", "data-bind":"value:$color"})))
			),
			div(
				input({type:"button", value:"Cancel", "data-bind":"click:close"}), " ",
				input({type:"button", value:"Save", "data-bind":"click:save"}), " ",
				input({type:"button", value:"Delete", "data-bind":"click:delProject"})
			)
		);
	}}
	
	function Model(data, pnl){var _=this;
		$.extend(_,{
			$id: ko.observable(data?data.id:"").extend({uniqueID:"registry"}),
			$name: ko.observable(data?data.name:"").extend({required:"Укажите название проекта"}),
			$color: ko.observable(data?data.color:""),
			$frozen: !data
		});
		$.extend(_,{
			save: function(){
				if(!validation.validate(_)) return;
				var d = util.getModelData(this);
				db.saveRegistryItem(d);
				_.close();
			},
			close: function(){
				require("forms/projectList").view(pnl);
			},
			delProject: function(){
				if(!confirm("Delete this project?"))return;
				db.deleteProject(_.$id());
				_.close();
			}
		});
	}
	
	return {
		view: function(pnl, id){
			pnl.html(template());
			var data = db.getRegistryItem(id);
			ko.applyBindings(new Model(data, pnl), pnl.find("div")[0]);
		}
	};
});