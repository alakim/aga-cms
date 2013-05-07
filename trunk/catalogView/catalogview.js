(function($,H){
	var templates = {
		main: function(doc){with(H){
			return div({"class":"catalogView"},
				ul({"class":"tagList"},
					apply(doc.tags, function(tag){
						return li(a({href:"#"+tag}, tag));
					})
				),
				div({"class":"itemList"},
					apply(doc.items, function(itm, idx){
						return templates.item(itm, idx);
					})
				)
			);
		}},
		item: function(itm, idx){with(H){
			var tags = itm.tags;
			if(typeof(tags)=="string")
				tags = tags.split(";");
			return div({"class":"item"+(idx%2?" odd":"")},
				h2(itm.name),
				div({"class":"tagList"},
					apply(tags, function(t){
						return span(t);
					})
				),
				itm.description?p(itm.description):null,
				itm.ref?p(a({href:itm.ref}, itm.ref.replace(/^http:\/\//, ""))):null
			);
		}}
	};
	
	function buildView(pnl, doc){
		pnl.html(templates.main(doc));
	}
	
	$.fn.catalogView = function(doc){
		$(this).each(function(i, pnl){
			buildView($(pnl), doc);
		});
	};
})(jQuery, Html);