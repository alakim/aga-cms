(function($,H){
	
	function buildView(el, jsDoc){
		var doc = $.parseJSON(jsDoc);
		var tagDict = {};
		collectTags(doc);
		var tags = [];
		for(var k in tagDict) tags.push(k);
		tags.sort();
		
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
						return a({href:"#"}, t);
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
					div(
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
					div(
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
					div(
						apply(d, function(evt){
							return div({"class":"section"},
								evt.txt
							);
						})
					)
				);
			}}
		};
		
		function updateView(){
			var pnl = $(templates.main(doc));
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