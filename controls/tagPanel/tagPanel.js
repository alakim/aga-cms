(function($,H){
	
	function buildReference(items, getItemTags){
		var ref = {};
		function addRef(tag, idx){
			if(!ref[tag]) ref[tag] = [];
			ref[tag].push(idx);
		}
		$.each(items, function(i, itm){
			$.each(getItemTags(itm), function(i, t){
				addRef(t, i);
			});
		});
		var tagList = [];
		for(var k in ref) tagList.push(k);
		tagList = tagList.sort();
		return {reference: ref, list: tagList};
	}
	
	function getSelectedItems(selectedTags, reference){
		var dict = {};
		$.each(selectedTags, function(i, t){
			$.each(reference.reference[t], function(j, idx){
				dict[idx] = true;
			});
		});
		var res = [];
		for(var idx in dict) res.push(parseInt(idx));
		return res;
	}
	
	function getSubTags(items, selItems, getItemTags){
		var dict = {};
		$.each(selItems, function(i, idx){
			$.each(getItemTags(items[idx]), function(j, t){
				dict[t] = true;
			});
		});
		var res = [];
		for(var k in dict) res.push(k);
		return res.sort();
	}
	
	function displaySubcloud(pnl, items, selectedTags, tList, reference, getItemTags, onselect){
		var selItems = getSelectedItems(tList, reference);
		var subTags = getSubTags(items, selItems, getItemTags);
		
		function template(){with(H){
			return markup(
				span({"class":"selectedTags"},
					"(",
					apply(tList, function(tag){
						return span({"class":"tag"}, tag);
					}, " & ", true),
					")[", selItems.length,"]"
				), " ",
				span({"class":"sub"},
					apply(subTags, function(t){
						return span(
							span({"class":"tag"}, t),
							"[", reference.reference[t].length,"]"
						);
					}, ", ")
				)
			);
		}}
		
		var subcloud = [];
		
		pnl.find(".subcloud").html(tList.length?template():"");
		//buildTagRefs(pnl.find(".subcloud"), items, selectedTags, reference, getItemTags, onselect);
		pnl.find(".subcloud .tag")
			.mouseover(function(){$(this).addClass("highlight")})
			.mouseout(function(){$(this).removeClass("highlight")})
			.click(function(){var _=$(this);
				var tag = _.text();
				clickTag(_, pnl, items, selectedTags, reference, getItemTags, onselect);
				if(selectedTags[tag]) _.addClass("selected"); else _.removeClass("selected");
			});
	}

	function buildPanel(pnl, items, onselect, getItemTags){
		var reference = buildReference(items, getItemTags);
		var selectedTags = {};
		
		function template(){with(H){
			return div({"class":"tagList"},
				apply(reference.list, function(t){
					return span({"class":"tag"}, t);
				}, ", "),
				div({"class":"subcloud"})
			);
		}}
		
		pnl.html(template());
		//buildTagRefs(pnl, items, selectedTags, reference, getItemTags, onselect);
		pnl.find(".tag")
			.mouseover(function(){$(this).addClass("highlight")})
			.mouseout(function(){$(this).removeClass("highlight")})
			.click(function(){var _=$(this);
				var tag = _.text();
				clickTag(_, pnl, items, selectedTags, reference, getItemTags, onselect);
				if(selectedTags[tag]) _.addClass("selected"); else _.removeClass("selected");
			});

	}
	
	function clickTag(label, pnl, items, selectedTags, reference, getItemTags, onselect){
		function getSelectedTagsList(){
			var res = [];
			for(var k in selectedTags){
				if(selectedTags[k]){
					res.push(k);
				}
			}
			return res;
		}
		var tag = $(label).text();
		selectedTags[tag] = selectedTags[tag]?false:true;
		var tList = getSelectedTagsList();
		displaySubcloud(pnl, items, selectedTags, tList, reference, getItemTags, onselect);
		onselect(tList);
	}
	
	// function buildTagRefs(pnl, items, selectedTags, reference, getItemTags, onselect){
	// 	
	// 	pnl.find(".tag")
	// 		.mouseover(function(){$(this).addClass("highlight")})
	// 		.mouseout(function(){$(this).removeClass("highlight")})
	// 		.click(function(){var _=$(this);
	// 			var tag = _.text();
	// 			// selectedTags[tag] = selectedTags[tag]?false:true;
	// 			// if(selectedTags[tag]) _.addClass("selected"); else _.removeClass("selected");
	// 			// var tList = getSelectedTagsList();
	// 			// displaySubcloud(pnl, items, tList, reference, getItemTags, onselect);
	// 			// onselect(tList);
	// 			clickTag(_, pnl, items, selectedTags, reference, getItemTags, onselect);
	// 			if(selectedTags[tag]) _.addClass("selected"); else _.removeClass("selected");
	// 		});
	// }
	
	
	$.fn.tagPanel = function(items, onselect, getItemTags){
		getItemTags = getItemTags || function(itm){return typeof(itm.tags)=="string"?itm.tags.split(";"):itm.tags;};
		$(this).each(function(i, el){
			buildPanel($(el), items, onselect, getItemTags);
		});
	};
})(jQuery, Html);