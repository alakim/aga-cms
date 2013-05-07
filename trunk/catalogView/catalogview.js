(function($,H){
	var templates = {
		main: function(doc, editMode){with(H){
			return markup(
			div({"class":"catalogView"},
				ul({"class":"tagList"},
					apply(doc.tags, function(tag){
						return li(a({href:"#"+tag}, tag));
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
			return div({id:"itm_"+idx, "class":"item"+(idx%2?" odd":"")},
				h2(itm.name),
				editMode?input({type:"button", value:"edit", "class":"btEditItem", style:"float:right;"}):null,
				div({"class":"tagList"},
					apply(tags, function(t){
						return span(t);
					})
				),
				itm.description?templates.itemDescription(itm):null,
				itm.ref?p(a({href:itm.ref}, itm.ref.replace(/^http:\/\//, ""))):null
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
				div("Description: ", textarea({"class":"propertyField", path:path+"/description"}))
			);
		}}
	};
	
	function buildView(pnl, doc, editMode){
		pnl.html(templates.main(doc, editMode));
		$(".item .btEditItem").click(function(){var _=$(this);
			var idx = parseInt(_.parent().attr("id").replace("itm_", ""));
			//alert(idx+" selected");
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