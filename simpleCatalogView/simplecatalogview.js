(function($,H){
	var selectedTags = {};
	
	function checkTags(tags){
		for(var i=0; i<tags.length; i++){
			if(selectedTags[tags[i]]) return true;
		}
		for(var k in selectedTags){
			if(selectedTags[k]) return false;
		}
		return true;
	}
	
	function catView(pnl, doc, editMode){
		var templates = {
			main: function(doc, editMode){with(H){
				return markup(
					div({"class":"catalogView"},
						ul({"class":"tagList"},
							apply(doc.tags, function(tag){
								return li(
									selectedTags[tag]?{"class":"selected"}:null,
									a({href:"#"+tag}, tag)
								);
							})
						),
						div({"class":"itemList"},
							apply(doc.items, function(itm, idx){
								return templates.item(itm, idx, editMode);
							})
						)
					),
					div({id:"catViewItemDialog"})
				);
			}},
			item: function(itm, idx, editMode){with(H){
				var tags = itm.tags;
				if(typeof(tags)=="string")
					tags = tags.split(";");
				if(!checkTags(tags)) return;
				return div({id:"itm_"+idx, "class":"item"+(idx%2?" odd":"")},
					editMode?span({"class":"btEditItem ui-icon ui-icon-pencil", style:"float:left;"}):null,
					h2(itm.name),
					div({"class":"tagList"},
						apply(tags, function(t){
							return span(t);
						})
					),
					itm.description?templates.itemDescription(itm):null,
					itm.ref?p(a({href:itm.ref}, itm.ref.replace(/^http:\/\//, ""))):null
				);
			}},
			imageList: function(itm){with(H){
				return div({"class":"imageList"},
					apply(itm.images, function(image, idx){
						return a({href:image.ref, target:"_blank"},
							img({src:image.ref, title:image.title, border:0})
						);
					})
				);
			}},
			itemDescription: function(itm){with(H){
				var dsc = itm.description.split("\n");
				return div({"class":"description"},
					apply(dsc, function(line){
						return p(line);
					})
				);
			}}
		};
		
		var view = $(templates.main(doc, editMode));
		pnl.html(view);
		
		view.find(".tagList a").click(function(){var _=$(this);
			var tag = _.attr("href").replace("#","");
			selectedTags[tag] = !selectedTags[tag]==true;
			catView(pnl, doc, editMode);
		});
		
		view.find(".btEditItem").button().click(function(){var _=$(this);
			var idx = parseInt(_.parent().attr("id").replace("itm_", ""));
			itemDialog(doc, idx, pnl);
		});
	}
	
	$.fn.simpleCatalogView = function(doc, editMode){
		$(this).each(function(i, pnl){
			catView($(pnl), doc, editMode);
		});
	};
})(jQuery, Html);