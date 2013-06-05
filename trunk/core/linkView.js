(function($,H){
	
	var templates = {
		main: function(doc, path, editMode){with(Html){
			var ref = path.match(/aga\/data\/xmlkb\//)?path.replace(/^.*aga\/data\/xmlkb\//, "xmlkb/page.php?p=")
				:path.replace(/^.*aga\/data\//, "data/");
			return div(
				div({"class":"editPnl"},
					input({type:"button", "class":"btnEdit", value:editMode?"View mode":"Edit mode"})
				),
				div({"class":"contentPnl"}, editMode?""
					:a({href:ref}, ref)
				)
			);
		}}
	};

	function buildView(pnl, doc, path, editMode){
		var view = $(templates.main(doc, path, editMode));
		pnl.html(view);
		$(".editPnl .btnEdit").click(function(){
			buildView(pnl, doc, !editMode);
		});
		if(editMode){
			view.find(".contentPnl").textEditor(doc, function(v){doc = v;});
		}
	}
	
	$.fn.linkView = function(doc, path){
		$(this).each(function(i, pnl){
			buildView($(pnl), doc, path, false);
		});
	};

	
})(jQuery, Html);