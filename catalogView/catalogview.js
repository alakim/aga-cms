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
				itm.ref?p(a({href:itm.ref}, itm.ref.replace(/^http:\/\//, ""))):null,
				itm.images?templates.imageList(itm):null
			);
		}},
		imageListEditor: function(doc, itmIdx){with(H){
			var path = "items/#"+itmIdx;
			var itm = JsPath.get(doc, path);
			return div(
				apply(itm.images, function(image, idx){
					var imgPath = path+"/images/#"+idx;
					return div(
						"Ref: ", input({type:"text", "class":"propertyField", path:imgPath+"/ref"}),
						"Title: ", input({type:"text", "class":"propertyField", path:imgPath+"/title"})
					)
				})
			);
		}},
		imageList: function(itm){with(H){
			return div({"class":"imageList"},
				apply(itm.images, function(image, idx){
					return a({href:image.ref},
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
		}},
		itemDialog: function(doc, idx){with(H){
			var path = "items/#"+idx;
			return div(
				div("Name: ", input({type:"text", "class":"propertyField", path:path+"/name"})),
				div("Tags: ", input({type:"text", "class":"propertyField", path:path+"/tags"})),
				div("Description: ", textarea({"class":"propertyField", path:path+"/description"})),
				div("Ref: ", input({type:"text", "class":"propertyField", path:path+"/ref"})),
				templates.imageListEditor(doc, idx)
			);
		}}
	};
	
	function buildView(pnl, doc, editMode){
		pnl.html(templates.main(doc, editMode));
		
		$(".catalogView .tagList a").click(function(){var _=$(this);
			var tag = _.attr("href").replace("#","");
			selectedTags[tag] = !selectedTags[tag]==true;
			buildView(pnl, doc, editMode);
		});
		
		$(".item .btEditItem").button().click(function(){var _=$(this);
			var idx = parseInt(_.parent().attr("id").replace("itm_", ""));
			$("#catViewItemDialog")
				.html(templates.itemDialog(doc, idx))
				.dialog({
					title:"Item #"+idx+" Properties",
					autoOpen: true,
					width: 600,
					buttons: [
						{
							text: "Ok",
							click: function() {var _=$(this);
								_.dialog( "close" );
								_.find(".propertyField").each(function(i,fld){fld=$(fld);
									var path = fld.attr("path"),
										val = fld.val();
									JsPath.set(doc, path, val);
								});
								buildView(pnl, doc, editMode);
							}
						},
						{
							text: "Cancel",
							click: function() {
								$( this ).dialog( "close" );
							}
						}
					]
				});
			$("#catViewItemDialog .propertyField").each(function(i, fld){fld=$(fld);
				var path = fld.attr("path");
				fld.val(JsPath.get(doc, path));
			});
		});
	}
	
	$.fn.catalogView = function(doc, editMode){
		$(this).each(function(i, pnl){
			buildView($(pnl), doc, editMode);
		});
	};
})(jQuery, Html);