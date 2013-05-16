(function($,H){
	
	function toHtml(str){
		str = str
			.replace(/&/ig, "&amp;")
			.replace(/</ig, "&lt;")
			.replace(/>/ig, "&gt;");
			
		str = str.split("\n");
		for(var i=0; i<str.length; i++){var ln = str[i];
			var mt = ln.match(/^( *)/);
			if(mt){
				var indent = mt[1];
				indent = indent.replace(/ /g, "&nbsp;");
				str[i] = str[i].replace(/^ */, indent);
			}
		}
		str = str.join("\n");
		return str
			.replace(/\n/ig, Html.br())
			.replace(/\t/ig, "&nbsp;&nbsp;&nbsp;&nbsp;");
	}
	var templates = {
		main: function(doc, editMode){with(Html){
			return div(
				div({"class":"editPnl"},
					input({type:"button", "class":"btnEdit", value:editMode?"View mode":"Edit mode"})
				),
				div({"class":"contentPnl"}, editMode?"":toHtml(doc))
			);
		}}
	};

	function buildView(pnl, doc, editMode){
		var view = $(templates.main(doc, editMode));
		pnl.html(view);
		$(".editPnl .btnEdit").click(function(){
			buildView(pnl, doc, !editMode);
		});
		if(editMode){
			view.find(".contentPnl").textEditor(doc, function(v){doc = v;});
		}
	}
	
	$.fn.textView = function(doc){
		$(this).each(function(i, pnl){
			buildView($(pnl), doc, false);
		});
	};

	
})(jQuery, Html);