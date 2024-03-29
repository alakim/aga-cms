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
	
	function updateTags(doc){
		var tags = {};
		$.each(doc.items, function(i, itm){
			var itmTags = itm.tags;
			if(typeof(itmTags)=="string") itmTags = itmTags.split(";");
			$.each(itmTags, function(j, t){tags[t] = true;});
		});
		doc.tags = [];
		for(var k in tags) doc.tags.push(k);
	}
	
	function fillFields(pnl, doc){
		$(pnl).find(".propertyField").each(function(i, fld){fld=$(fld);
			var propPath = fld.attr("path");
			fld.val(JsPath.get(doc, propPath));
		});
	}
	
	function saveFields(pnl, doc){
		$(pnl).find(".propertyField").each(function(i,fld){fld=$(fld);
			var propPath = fld.attr("path"), val = fld.val();
			JsPath.set(doc, propPath, val);
		});
	}
	
	function imageListEditor(pnl, doc, path){
		
		function tableTemplate(doc, itmPath){with(H){
			var itm = JsPath.get(doc, itmPath);
			return div({"class":"imageListEditor"},
				h3("Images:"),
				apply(itm.images, function(image, idx){
					return rowTemplate(itmPath, idx);
				}),
				div(span({path:itmPath}, span({"class":"ui-icon ui-icon-plusthick btAddImgRef", title:"Add Image Ref"})))
			);
		}}
		
		function rowTemplate(itmPath, imgIdx){with(H){
			var imgPath = itmPath+"/images/#"+(imgIdx==null?"*":imgIdx);
			return div(
				"Ref: ", input({type:"text", "class":"propertyField", path:imgPath+"/ref"}),
				"Title: ", input({type:"text", "class":"propertyField", path:imgPath+"/title"})
			)
		}}
		
		var editor = $(tableTemplate(doc, path));
		
		editor.find(".btAddImgRef").parent(). button().click(function(){var _=$(this);
			var path = _.attr("path");
			var itm = JsPath.get(doc, path);

			_.parent().before(
				rowTemplate(path)
			);
		});
		
		fillFields(editor, doc);
		
		$(pnl).html(editor);
	}
	
	function itemDialog(doc, idx, catViewPnl){
		var path = "items/#"+idx;
		
		function dlgTemplate(){with(H){
			return div(
				div("Name: ", input({type:"text", "class":"propertyField", path:path+"/name"})),
				div("Tags: ", input({type:"text", "class":"propertyField", path:path+"/tags"})),
				div("Description: ", textarea({"class":"propertyField", path:path+"/description"})),
				div("Ref: ", input({type:"text", "class":"propertyField", path:path+"/ref"})),
				//div(templates.imageListEditor(doc, path))
				div({"class":"imageListEditor"})
			);
		}}
		
		var dlg = $(dlgTemplate())
		$("#catViewItemDialog").html(dlg);
		
		dlg.dialog({
			title:"Item #"+idx+" Properties",
			autoOpen: true,
			width: 600,
			buttons: [
				{
					text: "Ok",
					click: function() {var _=$(this);
						_.dialog( "close" );
						saveFields(_, doc);
						updateTags(doc);
						catView(catViewPnl, doc, editMode);
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
		fillFields(dlg, doc);
		
		imageListEditor(dlg.find(".imageListEditor"), doc, path);
		
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
					itm.ref?p(a({href:itm.ref}, itm.ref.replace(/^http:\/\//, ""))):null,
					itm.images?templates.imageList(itm):null
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
	
	$.fn.catalogView = function(doc, editMode){
		$(this).each(function(i, pnl){
			catView($(pnl), doc, editMode);
		});
	};
})(jQuery, Html);