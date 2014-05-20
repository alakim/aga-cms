define(["html", "knockout", "db", "util", "validation"], function($H, ko, db, util, validation){
	var templates = {
		main: function(data){with($H){
			return div(
				h2("Resource Editor"),
				table({"class":"tbl_basicProperties", border:0, cellpadding:3, cellspacing:0},
					tr(th("ID"), td(templates.idField(data))),
					tr(th("Type"), td(templates.typeField(data))),
					tr(th("Name"), td(input({type:"text", "data-bind":"value:$name"}), util.validMsg("$name"))),
					tr(th("Description"), td(textarea({"data-bind":"value:$description"}))),
					tr(
						td({colspan:2},
							input({type:"button", value:"Save", "data-bind":"click:save"}), " ",
							input({type:"button", value:"Cancel", "data-bind":"click:close"})
						)
					)
				),
				div({"class":"extProperties"})
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
		}},
		siteModel: function(){with($H){
			return div(
				table({border:0, cellpadding:3, cellspacing:0},
					tr(th("URL"), td(input({type:"text", "data-bind":"value:$url"}))),
					tr(th("Title"), td(input({type:"text", "data-bind":"value:$title"})))
				)
			);
		}},
		personModel: function(){with($H){
			return div(
				table({border:0, cellpadding:3, cellspacing:0},
					tr(th("ID"), td(input({type:"text", "data-bind":"value:$id"})))
				)
			);
		}}
	};
	
	
	function PersonModel(data){var _=this;
		$.extend(_,{
			type:"person",
			$id: ko.observable(data?data.id:"")
		});
		
	}
	
	function SiteModel(data){var _=this;
		$.extend(_,{
			type:"site",
			$url: ko.observable(data?data.url:""),
			$title: ko.observable(data?data.title:"")
		});
		
	}

	
	function Model(data, prjID, pnl){var _=this;
		$.extend(_,{
			$id: ko.observable(data?data.id:"").extend({uniqueID:"projects/"+prjID+"/resources"}),
			$type: ko.observable(data?data.type:"").extend({required:"Выберите тип ресурса"}),
			$name: ko.observable(data?data.name:"").extend({required:"Укажите название ресурса"}),
			$description: ko.observable(data?data.description:"")
		});
		$.extend(_,{
			extModel:null,
			extModelView: ko.computed(function(){
				if(!_.$type()) return;
				if(_.type!=_.$type()) {
					_.extModel = _.$type()=="site"?new SiteModel(data)
						:_.$type()=="person"?new PersonModel(data)
						:null;
					$(".extProperties").html(templates[_.$type()+"Model"]());
					ko.applyBindings(_.extModel, $(".extProperties").find("div")[0]);
				}
				return _.extModel; 
			}),
			save: function(){
				if(!validation.validate(_)) return;
				var d = util.getModelData(this),
					extD = util.getModelData(this.extModel);
				$.extend(d, extD);
				//console.log(d);
				db.saveResource(prjID, d);
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
			ko.applyBindings(new Model(data, prjID, pnl), pnl.find(".tbl_basicProperties")[0]);
		}
	};
});