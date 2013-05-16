(function($,H){
	
	function buildView(el, jsDoc){
		var doc = $.parseJSON(jsDoc);
		var tagDict = {};
		collectTags(doc);
		var tags = [];
		for(var k in tagDict) tags.push(k);
		tags.sort();
		
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
		
		function collectTags(nd){
			if(nd instanceof Array){
				$.each(nd, function(i, itm){
					itm.tags = itm.tags.split(";");
					$.each(itm.tags, function(j, t){
						tagDict[t] = true;
					});
				})
			}
			else{
				for(var k in nd) collectTags(nd[k]);
			}
		}
		
		var templates = {
			tagList: function(doc){with(H){
				return div({"class":"tagList"},
					apply(tags, function(t){
						return a({href:"#"}, selectedTags[t]?{"class":"selected"}:null, t);
					}, " ")
				);
			}},
			main:function(doc){with(H){
				return div(
					templates.tagList(doc),
					apply(doc, function(y, yNr){
						return templates.year(y, yNr);
					})
				);
			}},
			year: function(y, yNr){with(H){
				return div(
					h2(yNr),
					div({"class":"year"},
						apply(y, function(m, mNr){
							return templates.month(m, mNr, yNr);
						})
					)
				);
			}},
			month: function(m, mNr, yNr){with(H){
				if(mNr<10)mNr = "0"+mNr;
				return div({"class":"section"},
					h3(yNr, ".", mNr),
					div({"class":"month"},
						apply(m, function(d, dNr){
							return templates.day(d, dNr, mNr, yNr);
						})
					)
				);
			}},
			day: function(d, dNr, mNr, yNr){with(H){
				if(dNr<10)dNr = "0"+dNr;
				return div({"class":"section"},
					h4(yNr, ".", mNr, ".", dNr),
					div({"class":"day"},
						apply(d, function(evt){
							if(!checkTags(evt.tags)) return;
							return div({"class":"section"},
								evt.t?span({"class":"time"}, evt.t, " "):null, 
								evt.txt
							);
						})
					)
				);
			}}
		};
		
		function hideEmptySections(pnl){
			pnl.find(".day").each(function(i, d){d=$(d);
				if(!d.text().length)
					d.parent().html("");
			});
		}
		
		function updateView(){
			var pnl = $(templates.main(doc));
			el.html(pnl);
			pnl.find(".tagList a").click(function(){var _=$(this);
				var tag = _.text();
				selectedTags[tag] = !selectedTags[tag];
				updateView();
			});
			hideEmptySections(pnl);
		}
		updateView();
	}
	
	$.fn.diaryView = function(jsDoc){
		$(this).each(function(i, el){
			buildView($(el), jsDoc);
		});
	};
})(jQuery, Html);