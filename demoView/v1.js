(function($,H){
	var templates = {
		main: function(doc){with(H){
			return markup(
				"VIEW 1"
			);
		}}
	};
	
	function buildView(pnl, doc){
		pnl.html(templates.main(doc));
	}
	
	$.fn.view1 = function(doc){
		$(this).each(function(i, pnl){
			buildView($(pnl, doc));
		});
	};
})(jQuery, Html);