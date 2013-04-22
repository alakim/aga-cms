(function($,H){
	function toHtml(str){
		return str
			.replace(/\n/ig, Html.br())
			.replace(/\t/ig, "&nbsp;&nbsp;&nbsp;&nbsp;");
	}
	var templates = {
		main: function(doc, editMode){with(Html){
			return div(toHtml(doc));
		}}
	};

	function buildView(pnl, doc, editMode){
		pnl.html(templates.main(doc, editMode));
	}
	
	$.fn.textView = function(doc){
		$(this).each(function(i, pnl){
			buildView($(pnl), doc, false);
		});
	};

	
})(jQuery, Html);