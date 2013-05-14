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
	
	function collectTags(doc){
		var tags = {};
		$.each(doc.items, function(i, itm){
			var itags = itm.tags;
			if(typeof(itags)=="string")
				itags = itags.split(";");
			$.each(itags, function(j, tg){
				tags[tg] = true;
			});
		});
		var res = [];
		for(var k in tags){
			res.push(k);
		}
		return res;
	}
	
	function catView(pnl, doc, json){
		var templates = {
			main: function(doc){with(H){
				return markup(
					div(
						input({type:"button", "class":"btToggleMode", value:"Edit Mode"})
					),
					div({"class":"catalogView"},
						ul({"class":"tagList"},
							apply(collectTags(doc), function(tag){
								return li(
									selectedTags[tag]?{"class":"selected"}:null,
									a({href:"#"+tag}, tag)
								);
							})
						),
						div({"class":"itemList"},
							apply(doc.items, function(itm, idx){
								return templates.item(itm, idx);
							})
						)
					),
					div({id:"catViewItemDialog"})
				);
			}},
			item: function(itm, idx){with(H){
				var tags = itm.tags;
				if(typeof(tags)=="string")
					tags = tags.split(";");
				if(!checkTags(tags)) return;
				return div({id:"itm_"+idx, "class":"item"+(idx%2?" odd":"")},
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
		
		var view = $(templates.main(doc));
		pnl.html(view);
		view.find(".btToggleMode").click(function(){
			editView(pnl, doc, json);
		});
		
		view.find(".tagList a").click(function(){var _=$(this);
			var tag = _.attr("href").replace("#","");
			selectedTags[tag] = !selectedTags[tag]==true;
			catView(pnl, doc, json);
		});
		
		
	}
	
	function editView(pnl, doc, jsdoc){
		function template(){with(H){
			return markup(
				div(input({type:"button", "class":"btToggleMode", value:"View Mode"})),
				div(
					input({type:"button", "class":"btnSave", value:"Save"}),
					" file name:",
					input({type:"text", "class":"fldFileName", value:Editor.docPath}),
					" encode",
					input({type:"checkbox", "class":"cbEncode"}, Editor.secure?{checked:true}:null)
				),
				textarea({"class":"fldJsonDoc", style:style({width:600, height:300})}, jsdoc)
			);
		}}
		
		var view = $(template());
		pnl.html(view);
		view.find(".btToggleMode").click(function(){
			catView(pnl, doc, jsdoc);
		});
		pnl.find(".btnSave").click(function(){
			var filePath = pnl.find(".fldFileName").val();
			var encode = pnl.find(".cbEncode")[0].checked;
			var jsDoc = pnl.find(".fldJsonDoc").val();
			Editor.save(filePath, jsDoc, function(){
				alert("Saved "+filePath);
			}, encode, function(){
				alert("Error saving file "+filePath);
			});
		});

	}
	
	$.fn.simpleCatalogView = function(json){
		var doc;
		try{doc = $.parseJSON(json);}
		catch(e){alert("Error parsing JSON");}
		
		$(this).each(function(i, pnl){
				catView($(pnl), doc, json);
		});
	};
})(jQuery, Html);