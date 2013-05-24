(function($,H){
	function normalizeDoc(doc){
		$.each(doc.items, function(i, itm){
			if(!itm.tags) itm.tags = [];
			if(typeof(itm.tags)=="string") itm.tags = itm.tags.split(";");
			itm.tags = itm.tags.sort();
		});
	}
	
	
	function updateView(pnl, doc, selectedTags){
		selectedTags = selectedTags || [];
		var tagDict = {};
		$.each(selectedTags, function(i, tag){tagDict[tag] = true;});
		
		function checkTags(itm){
			if(!selectedTags.length) return true;
			for(var i=0; i<itm.tags.length; i++){
				if(tagDict[itm.tags[i]]) return true;
			}
			return false;
		}
		
		function template(){with(H){
			return table(
				apply(doc.items, function(itm){
					return checkTags(itm)?tr(
						td(
							apply(itm.tags, function(tag){
								return span(tag);
							}, ", ")
						),
						td(a({href:itm.url}, itm.label)),
						td(itm.dsc)
					):null;
				})
			);
		}}
		pnl.find(".viewPanel").html(template());
	}

	function buildView(pnl, jsDoc){
		var doc = $.parseJSON(jsDoc);
		normalizeDoc(doc);
		
		function template(){with(H){
			return div({"class":"lcatView"},
				div({"class":"tagsPanel"}),
				div({"class":"viewPanel"})
			);
		}}
		
		var view = $(template());
		pnl.html(view);
		
		updateView(view, doc);
		
		view.find(".tagsPanel").tagPanel(doc.items, function(selectedTags){
			updateView(pnl, doc, selectedTags);
		});
	}
	
	function formatJson(doc){
		
	}
	
	$.fn.lcatView = function(jsDoc){
		$(this).each(function(i, el){
			buildView($(el), jsDoc);
		});
	};
})(jQuery, Html);