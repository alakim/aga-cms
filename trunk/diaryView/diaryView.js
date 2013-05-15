(function($,H){
	
	function buildView(el, jsDoc){
		var tags = [];
		var selectedTags = {};
		
		function checkTags(tList){
			for(var i=0; i<tList.length; i++){
				if(selectedTags[tList[i]]) return true;
			}
			return noTagsSelected();
		}
		function noTagsSelected(){
			for(var k in selectedTags){
				if(selectedTags[k]) return false;
			}
			return true;
		}
		
		function template(doc){with(H){
			return div(
				div({"class":"tagList"},
					apply(tags, function(tg){
						return markup(" ",
							a({href:"#"}, selectedTags[tg]?{"class":"selected"}:null, tg)
						);
					})
				),
				apply(doc, function(itm){
					return checkTags(itm.tags)?div(
						itm.t, ": ",
						span({style:"font-style:italic;"}, "[", itm.tags.join(","), "] "),
						itm.txt
					):null;
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
		selectedTags = {};
		
		function updateView(){
			var pnl = $(template(doc));
			el.html(pnl);
			pnl.find(".tagList a").click(function(){var _=$(this);
				var tag = _.text();
				selectedTags[tag] = !selectedTags[tag];
				updateView();
			});
		}
		updateView();
	}
	
	$.fn.diaryView = function(jsDoc){
		$(this).each(function(i, el){
			buildView($(el), jsDoc);
		});
	};
})(jQuery, Html);