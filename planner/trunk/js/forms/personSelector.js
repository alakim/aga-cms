define(["jquery", "html", "knockout", "db"], function($, $H, ko, db){
	
	function template(persons){with($H){
		var list = [];
		for(var id in persons){
			var pers = persons[id];
			list.push({id:id, name:pers.name});
		}
		list.sort(function(p1, p2){
			return p1.name==p2.name?0:p1.name>p2.name?1:-1;
		});
		return div(
			h2("Person Selector"),
			ul(
				li(span({"class":"selectable", "data-bind":"click:select", persID:""}, "[ NONE ]")),
				apply(list, function(pers){
					return li(span({"class":"selectable", "data-bind":"click:select", persID:pers.id},
						pers.name,
						format(" ({0})", pers.id)
					));
				})
			)
		);
	}}
	

	
	function Model(onSelect){
		$.extend(this, {
			select: function(mod, e){
				mod.onSelect($(e.target).attr("persID"));
				this.close();
			},
			onSelect: onSelect,
			close: function(){
				$("#personSelector").slideUp().html("");
			}
		});
	}
	
	return {
		view: function(onSelect){
			var pnl = $("#personSelector");
			pnl.hide().html(template(db.getPersons())).slideDown();
			pnl.find("th").attr({align:"right"});
			ko.applyBindings(new Model(onSelect), pnl.find("div")[0]);
		}
	};
});