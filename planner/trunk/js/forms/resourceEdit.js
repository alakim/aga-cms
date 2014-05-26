define(["html", "knockout", "db", "util", "validation"], function($H, ko, db, util, validation){
	var templates = {
		main: function(data){with($H){
			return div(
				h2("Resource Editor"),
				table({border:0, cellpadding:3, cellspacing:0},
					tr(th("ID"), td(templates.idField(data))),
					tr(th("Type"), td(templates.typeField(data))),
					tr(th("Name"), td(input({type:"text", "data-bind":"value:$name"}), util.validMsg("$name"))),
					tr(th("Description"), td(textarea({"data-bind":"value:$description"}))),
					tr({"data-bind":"visible:siteMode"}, th("URL"), td(input({type:"text", "data-bind":"value:$url"}))),
					// tr({"data-bind":"visible:siteMode"}, th("Title"), td(input({type:"text", "data-bind":"value:$title"}))),
					tr({"data-bind":"visible:personMode"}, th("Person ID"), td(input({type:"text", "data-bind":"value:$personID"}))),
					
					tr(
						td({colspan:2},
							input({type:"button", value:"Save", "data-bind":"click:save"}), " ",
							input({type:"button", value:"Cancel", "data-bind":"click:close"}), " ",
							input({type:"button", value:"Delete", "data-bind":"click:delResource"})
						)
					)
				)
			)
		}},
		typeField: function(data){with($H){
			return markup(
				select({"data-bind":"value:$type"},
					option({value:"text"}, "Text"),
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
		var path = "projects/"+prjID+"/resources";
		
		$.extend(_,{
			$id: ko.observable(data?data.id:"").extend({uniqueID:data?{path:path, exclude:data.id}:path}),
			$type: ko.observable(data?data.type:"").extend({required:"Выберите тип ресурса"}),
			$name: ko.observable(data?data.name:"").extend({required:"Укажите название ресурса"}),
			$description: ko.observable(data?data.description:""),
			$url: ko.observable(data?data.url:""),
			// $title: ko.observable(data?data.title:""),
			$personID: ko.observable(data?data.id:"")
		});
		
		$.extend(_,{
			siteMode: ko.computed(function(){return _.$type()=="site";}),
			personMode: ko.computed(function(){return _.$type()=="person";}),
			textMode: ko.computed(function(){return _.$type()=="text";}),
			save: function(){
				if(!validation.validate(_)) return;
				// var d = util.getModelData(this);
				var d = {
					id: _.$id(),
					type: _.$type(),
					name: _.$name(),
					description: _.$description()
				};
				if(d.type=="site") d.url = _.$url();
				if(d.type=="person") d.personID = _.$personID();
				//console.log(d);
				db.saveResource(prjID, d);
				_.close();
			},
			close: function(){
				require("forms/projectView").view(prjID, pnl);
			},
			delResource: function(){
				if(!confirm("Delete this resource?")) return;
				db.delResource(prjID, _.$id());
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