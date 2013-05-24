(function($,H){

	function buildView(pnl, jsDoc){
		function template(){with(H){
			return "*** LCAT VIEW ***";
		}}
		
		pnl.html(template());
	}
	
	function formatJson(doc){
		function formatDay(day, indent){
			var js = [];
			day = sortByTime(day);
			for(var i=0; i<day.length; i++){var evt = day[i];
				var dd = {};
				$.extend(dd, evt);
				if(dd.tags) dd.tags = dd.tags.join(";");
				js.push(indent+"\t"+JSON.stringify(dd))
			}
			return "[\n"+js.join(",\n")+"\n"+indent+"]";
		}
		
		function formatSection(sect, indent){
			indent = indent || "";
			if(sect instanceof Array) return formatDay(sect, indent);
			var js = [];
			var keys = getSortedKeys(sect);
			$.each(keys, function(i, k){
				js.push(indent+"\t\""+k+"\":"+formatSection(sect[k], indent+"\t"));
			});
			js = js.join(",\n");
			return "{\n"+js+"\n"+indent+"}"
		}
		return formatSection(doc);
	}
	
	$.fn.lcatView = function(jsDoc){
		$(this).each(function(i, el){
			buildView($(el), jsDoc);
		});
	};
})(jQuery, Html);