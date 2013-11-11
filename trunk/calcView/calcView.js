(function($,$H){

	function buildView(el, doc){
		for(var k in doc.templates){
			var code = doc.templates[k];
			code = code.split("|");
			doc.templates[k] = new Function(code[0], "with(Html){"+code[1]+"}");
		}
		el.html(doc.templates.main(doc, $, $H));
	}
	
	$.fn.calcView = function(jsDoc){
		console.log(jsDoc);
		var doc = JSON.parse(jsDoc);
		console.log(doc);
		$(this).each(function(i, el){
			buildView($(el), doc);
		});
	};
})(jQuery, Html);