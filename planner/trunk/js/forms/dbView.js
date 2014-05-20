define(["jquery", "html", "db"], function($, $H, db){
	var templates = {
		main: function(jsonCode){with($H){
			var data = $.parseJSON(jsonCode);
			return div(
				h2("Local DB"),
				templates.val(data)
			);
		}},
		obj: function(obj){with($H){
			return div(
				div({"class":"dataType"}, "object"),
				table({border:1, cellpadding:3, cellspacing:0},
					apply(obj, function(v, nm){
						return tr(
							th({valign:"top", align:"right"}, nm),
							td(templates.val(v))
						);
					})
				)
			);
		}},
		arr: function(obj){with($H){
			return div(
				div({"class":"dataType"}, "array"),
				table({border:1, cellpadding:3, cellspacing:0},
					apply(obj, function(v, idx){
						return tr(
							th({valign:"top"}, idx),
							td(templates.val(v))
						);
					})
				)
			);
		}},
		
		val: function(v){with($H){
			if(v instanceof Array)
				return templates.arr(v);
			if(typeof(v)=="object")
				return templates.obj(v);
			return div(span({"class":"dataType"}, typeof(v)), v);
		}}
	};
	
	
	return {
		view: function(pnl){var _=this;
			pnl.html(templates.main(db.getJSON()));
		}
	};
});