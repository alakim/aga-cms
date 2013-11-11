(function($,H){

	function buildView(el, jsDoc){
		el.html(jsDoc.templates.main(jsDoc));
	}
	
	$.fn.calcView = function(jsDoc){
		$(this).each(function(i, el){
			buildView($(el), jsDoc);
		});
	};
})(jQuery, Html);