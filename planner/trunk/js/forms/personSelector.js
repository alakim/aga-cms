define(["jquery", "html", "knockout", "dataSource"], function($, $H, ko, ds){
	
	function template(persons){with($H){
		return div(ul(
			apply(persons, function(pers){
				return li(span({"class":"selectable", "data-bind":"click:select", persID:pers.id},
					pers.name,
					format(" ({0})", pers.id)
				));
			})
		));
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
			pnl.hide().html(template(ds.getPersons())).slideDown();
			pnl.find("th").attr({align:"right"});
			ko.applyBindings(new Model(onSelect), pnl.find("div")[0]);
		}
	};
});