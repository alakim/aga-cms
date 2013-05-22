(function($,H){
	function collectTags(items, getItemTags){
		var tagDict = {};
		$.each(items, function(i, itm){
			var tags = getItemTags(itm);
			$.each(tags, function(i, t){
				tagDict[t] = true;
			});
		});
		var res = [];
		for(var k in tagDict)
			res.push(k);
		res = res.sort();
		return res;
	}

	function buildPanel(pnl, items, onselect, getItemTags){
		var tags = collectTags(items, getItemTags);
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
				apply(tags, function(t){
					return span({"class":"tag"}, t);
				}, ", ")
			);
		}}
		
		pnl.html(template());
		pnl.find(".tag")
			.mouseover(function(){$(this).addClass("highlight")})
			.mouseout(function(){$(this).removeClass("highlight")})
			.click(function(){var _=$(this);
				var tag = _.text();
				selectedTags[tag] = selectedTags[tag]?false:true;
				if(selectedTags[tag]) _.addClass("selected");
				else _.removeClass("selected");
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