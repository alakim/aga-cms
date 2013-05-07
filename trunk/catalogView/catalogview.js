(function($,H){
	var templates = {
		main: function(doc, editMode){with(H){
			return div({"class":"catalogView"},
				ul({"class":"tagList"},
					apply(doc.tags, function(tag){
						return li(a({href:"#"+tag}, tag));
					})
				),
				div({"class":"itemList"},
					apply(doc.items, function(itm, idx){
						return templates.item(itm, idx, editMode);
					})
				)
			);
		}},
		item: function(itm, idx, editMode){with(H){
			var tags = itm.tags;
			if(typeof(tags)=="string")
				tags = tags.split(";");
			return div({id:"itm_"+idx, "class":"item"+(idx%2?" odd":"")},
				h2(itm.name),
				editMode?input({type:"button", value:"edit", "class":"btEditItem", style:"float:right;"}):null,
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
	
	function buildView(pnl, doc, editMode){
		pnl.html(templates.main(doc, editMode));
		$(".item .btEditItem").click(function(){var _=$(this);
			var idx = parseInt(_.parent().attr("id").replace("itm_", ""));
			alert(idx+" selected");
		});
	}
	
	$.fn.catalogView = function(doc, editMode){
		$(this).each(function(i, pnl){
			buildView($(pnl), doc, editMode);
		});
	};
})(jQuery, Html);