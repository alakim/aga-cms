(function($,H){
	var templates = {
		main: function(doc, editMode){with(H){
			// if(doc instanceof Array)
				// return templates.node(null, doc, "", editMode);
			return div({"class":"defaultView"},
				div({"class":"editPnl"},
					input({type:"button", "class":"btnEdit", value:editMode?"View mode":"Edit mode"}),
					editMode?input({type:"button", "class":"btnSave", value:"Save"}):null
				),
				ul(
					apply(doc, function(nd, nm){
						return templates.node(nm, nd, nm, editMode);
					})
				)
			);
		}},
		node: function(nm, val, path, editMode){with(H){
			return li(
				span({"class":"fldNm"}, nm), ": ",
				val instanceof Array?markup(
					ol(
						apply(val, function(n, i){
							return li(
								editMode?input({type:"text", "class":"fieldBox", path:path+"/#"+i, value:n})
								:n
							);
						})
					),
					editMode?div(
						input({type:"button", "class":"btnAdd2Array", path:path, value:"add element"}),
						templates.typeSelector()
					):null
				)
				:typeof(val)=="object"?markup(
					ul(
						apply(val, function(n, k){
							return templates.node(k, n, path+"/"+k, editMode);
						})
					),
					editMode?div(
						input({type:"button", "class":"btnAdd2Object", path:path, value:"add attribute"}),
						input({type:"text", "class":"fldNm"}),
						templates.typeSelector()
					):null
				)
				:editMode?input({type:"text", "class":"fieldBox", path:path, valType:typeof(val), value:val})
				:span(val)
			);
		}},
		typeSelector: function(){with(H){
			return select({"class":"selValType"},
				option({value:"string", selected:true}, "string"),
				option({value:"int"}, "int"),
				option({value:"float"}, "float"),
				option({value:"Array"}, "Array"),
				option({value:"object"}, "object")
			);
		}}
	};

	function buildView(pnl, doc, editMode){
		pnl.html(templates.main(doc, editMode));
		$(".editPnl .btnEdit").click(function(){
			buildView(pnl, doc, !editMode);
		});
		$(".editPnl .btnSave").click(function(){
			console.log("saved: ", doc);
		});
		function fieldChange(){var _=$(this);
			var path = _.attr("path");
			var val = _.val();
			var valType = _.attr("valType");
			if(valType=="number")
				val = parseFloat(val);
			JsPath.set(doc, path, val);
		}
		$(".defaultView .fieldBox").change(fieldChange);
		$(".defaultView .btnAdd2Array").click(function(){var _=$(this);
			var path = _.attr("path");
			var arr = JsPath.get(doc, path);
			_.parent().prev()
				.append(H.li(H.input({type:"text", "class":"fieldBox", path:path+"/#"+arr.length})))
				.find(".fieldBox").change(fieldChange);
		});
		$(".defaultView .btnAdd2Object").click(function(){var _=$(this);
			var path = _.attr("path");
			var attNm = _.next(".fldNm").val();
			console.log(attNm);
			var arr = JsPath.get(doc, path);
			_.parent().prev()
				.append(H.li(
					H.span({"class":"fldNm"}, attNm), ": ",
					H.input({type:"text", "class":"fieldBox", path:path+"/"+attNm})
				))
				.find(".fieldBox").change(fieldChange);
		});
	}
	
	$.fn.defaultView = function(doc){
		$(this).each(function(i, pnl){
			buildView($(pnl), doc, false);
		});
	};

	
})(jQuery, Html);