(function($,H){
	
	function buildView(el, jsDoc){
		var tags = [];
		
		function template(doc){with(H){
			return div(
				div({"class":"tagList"},
					apply(tags, function(tg){
						return markup(" ",
							a({href:"#"}, tg)
						);
					})
				),
				apply(doc, function(itm){
					return div(
						itm.t, ": ",
						span({style:"font-style:italic;"}, "[", itm.tags.join(","), "] "),
						itm.txt
					);
				})
			);
		}}
		
		function prepareData(doc){
			tagDict = {};
			$.each(doc, function(i, itm){
				if(typeof(itm.tags)=="string")
					itm.tags = itm.tags.split(";");
				$.each(itm.tags, function(j, tg){
					tagDict[tg] = true;
				});
			});
			
			tags = [];
			for(var k in tagDict)
				tags.push(k);
			tags = tags.sort();
		}
		
		var doc;
		try{doc = $.parseJSON(jsDoc);}
		catch(e){alert("JSON parsing error!"); return;}
		
		prepareData(doc);
		var pnl = $(template(doc));
		el.html(pnl);
		pnl.find(".tagList a").click(function(){var _=$(this);
			var tag = _.text();
			alert(tag + " selected!");
		});
	}
	
	$.fn.diaryView = function(jsDoc){
		$(this).each(function(i, el){
			buildView($(el), jsDoc);
		});
	};
})(jQuery, Html);