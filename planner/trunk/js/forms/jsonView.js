define(["jquery", "html", "knockout", "db"], function($, $H, ko, db){
	var templates = {
		main: function(){with($H){
			return div(
				h2("Local DB JSON View"),
				textarea({style:"width:550px; height:400px;", "data-bind":"value:code"}),
				div(
					input({type:"button", value:"Save", "data-bind":"click:save"})
				)
			);
		}}
	};
	
	function Model(json){var _=this;
		_.code = ko.observable(json);
		_.save = function(){
			db.setJSON(_.code());
		};
	}
	
	return {
		view: function(pnl){var _=this;
			pnl.html(templates.main());
			ko.applyBindings(new Model(db.getJSON()), pnl.find("div")[0]);
		}
	};
});