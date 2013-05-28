(function($,H){
	
	function buildReference(items, getItemTags){
		var ref = {};
		function addRef(tag, itm){
			if(!ref[tag]) ref[tag] = [];
			ref[tag].push(itm);
		}
		$.each(items, function(i, itm){
			$.each(getItemTags(itm), function(i, t){
				addRef(t, itm);
			});
		});
		var tagList = [];
		for(var k in ref) tagList.push(k);
		tagList = tagList.sort();
		return {reference: ref, list: tagList};
	}
	
	function displaySubcloud(pnl, items, selectedTags){
		function template(){with(H){
			return markup(
				span({"class":"selected"},
					apply(selectedTags, function(v, tag){
						return v?span(tag):null;
					}, " & ", true)
				)
			);
		}}
		
		pnl.find(".subcloud").html(template());
	}

	function buildPanel(pnl, items, onselect, getItemTags){
		var reference = buildReference(items, getItemTags);
		var selectedTags = {};
		
		function getSelectedTagsList(){
			var res = [];
			for(var k in selectedTags){
				if(selectedTags[k]){
					res.push(k);
				}
			}
			return res;
		}
		
		function template(){with(H){
			return div({"class":"tagList"},
				apply(reference.list, function(t){
					return span({"class":"tag"}, t);
				}, ", "),
				div({"class":"subcloud"})
			);
		}}
		
		pnl.html(template());
		pnl.find(".tag")
			.mouseover(function(){$(this).addClass("highlight")})
			.mouseout(function(){$(this).removeClass("highlight")})
			.click(function(){var _=$(this);
				var tag = _.text();
				selectedTags[tag] = selectedTags[tag]?false:true;
				if(selectedTags[tag]) _.addClass("selected"); else _.removeClass("selected");
				displaySubcloud(pnl, items, selectedTags);
				onselect(getSelectedTagsList());
			});
	}
	
	$.fn.tagPanel = function(items, onselect, getItemTags){
		getItemTags = getItemTags || function(itm){return typeof(itm.tags)=="string"?itm.tags.split(";"):itm.tags;};
		$(this).each(function(i, el){
			buildPanel($(el), items, onselect, getItemTags);
		});
	};
})(jQuery, Html);