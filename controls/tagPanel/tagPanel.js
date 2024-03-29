(function($,H){
	
	function buildReference(items, getItemTags, selItems){
		var ref = {};
		function addRef(tag, idx){
			if(!ref[tag]) ref[tag] = [];
			ref[tag].push(idx);
		}
		if(selItems){
			$.each(selItems, function(i, idx){
				$.each(getItemTags(items[idx]), function(j, t){
					addRef(t, idx);
				});
			});
		}
		else {
			$.each(items, function(i, itm){
				$.each(getItemTags(itm), function(j, t){
					addRef(t, i);
				});
			});
		}
		var tagList = [];
		for(var k in ref) tagList.push(k);
		tagList = tagList.sort();
		return {reference: ref, list: tagList};
	}
	
	function displaySubcloud(pnl, items, selItems, selectedTags, tList, reference, getItemTags, onselect){
		var subRef = buildReference(items, getItemTags, selItems);
		var subList = subRef.list.sort(function(x, y){
			var lx = subRef.reference[x].length,
				ly = subRef.reference[y].length;
			return lx>ly?-1:lx<ly?1:0;
		});
		
		function getSuperTags(){
			var dict = {};
			$.each(selItems, function(i, idx){
				var itm = items[idx];
				var tags = getItemTags(itm);
				$.each(tags, function(j, t){
					dict[t] = true;
				});
			});
			var res = [];
			for(var t in dict){
				if(
					reference.reference[t].length>subRef.reference[t].length // �.�. ����� ���������� ��������� ���� ��� �������� � ���� ����� ��� ���� �������
				)res.push(t);
			}
			return res.sort(function(x,y){
				var lx = reference.reference[x].length, ly = reference.reference[y].length;
				return lx>ly?1:lx<ly?-1:0;
			});
		}
		
		function template(){with(H){
			var superTags = getSuperTags(selectedTags, items, selItems, getItemTags, reference);
			return markup(
				span(
					apply(superTags, function(t){
						return span(
							span({"class":"tag super"}, t), "[", reference.reference[t].length,"]"
						);
					}, ", ")
				), " ",
				span({"class":"selectedTags"},
					"(",
					apply(tList, function(tag){
						return span({"class":"tag"}, tag);
					}, " & ", true),
					")[", selItems.length, "/", items.length,"]"
				), " ",
				span({"class":"sub"},
					apply(subList, function(t){
						return selectedTags[t]?null:span(
							span({"class":"tag"}, t),
							"[",
							subRef.reference[t].length, 
							subRef.reference[t].length!=reference.reference[t].length?markup("/", reference.reference[t].length):null,
							"]"
						);
					}, ", ", true)
				)
			);
		}}
		
		var subcloud = [];
		
		pnl.find(".subcloud").html(tList.length?template():"");
		pnl.find(".subcloud .tag")
			.mouseover(function(){$(this).addClass("highlight")})
			.mouseout(function(){$(this).removeClass("highlight")})
			.click(function(){var _=$(this);
				var tag = _.text();
				clickTag(_, pnl, items, selectedTags, reference, getItemTags, _.hasClass("super"), onselect);
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
		pnl.find(".tag")
			.mouseover(function(){$(this).addClass("highlight")})
			.mouseout(function(){$(this).removeClass("highlight")})
			.click(function(){var _=$(this);
				var tag = _.text();
				clickTag(_, pnl, items, selectedTags, reference, getItemTags, true, onselect);
				_.parent().find(".tag").removeClass("selected");
				_.addClass("selected");
			});

	}
	
	function clickTag(label, pnl, items, selectedTags, reference, getItemTags, setAsRoot, onselect){
		function getSelectedItems(selectedTags){
			var dict = {};
			$.each(selectedTags, function(i, t){
				$.each(reference.reference[t], function(j, idx){
					if(!dict[idx]) dict[idx] = 1;
					else dict[idx]+=1;
				});
			});
			var res = [];
			for(var k in dict){
				if(dict[k]==selectedTags.length) res.push(k);
			}
			return res;
		}
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
		if(setAsRoot) selectedTags = {};
		selectedTags[tag] = selectedTags[tag]?false:true;
		var tList = setAsRoot?[tag]:getSelectedTagsList();
		var selItems = getSelectedItems(tList);
		displaySubcloud(pnl, items, selItems, selectedTags, tList, reference, getItemTags, onselect);
		onselect(tList, selItems);
	}
	
	
	$.fn.tagPanel = function(items, onselect, getItemTags){
		getItemTags = getItemTags || function(itm){return typeof(itm.tags)=="string"?itm.tags.split(";"):itm.tags;};
		$(this).each(function(i, el){
			buildPanel($(el), items, onselect, getItemTags);
		});
	};
})(jQuery, Html);