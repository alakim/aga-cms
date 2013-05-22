(function($,H){
	function buildField(el, doc){
		var path = el.attr("path")
		function template(){with(H){
			var val = JsPath.get(doc, path);
			return span({"class":"editField"},
				input({type:"text", "class":"valField", style:style({width: el.width()}), value: val}),
				input({type:"button", "class":"btOK", value:"OK"}),
				input({type:"button", "class":"btCancel", value:"Cancel"})
			);
		}}
		
		el.addClass("valueField").after(template());
			
		el.click(function(){var _=$(this);
			el.hide();
			var eFld = el.next(".editField");
			var vFld = eFld.find(".valField");
			vFld.width(el.width());
			eFld.show();
			vFld[0].focus();
		});
		var eFld = el.next(".editField");
		eFld.find(".btOK").click(function(){var _=$(this);
			var fld = _.parent();
			var val = fld.find(".valField").val();
			JsPath.set(doc, path, val);
			fld.prev().html(JsPath.get(doc, path)).show();
			fld.hide();
		});
		eFld.find(".btCancel").click(function(){var _=$(this);
			var fld = _.parent();
			fld.prev().html(JsPath.get(doc, path)).show();
			fld.hide();
		});
	}
	
	$.fn.editField = function(doc){
		$(this).each(function(i, el){
			buildField($(el), doc);
		});
	};
})(jQuery, Html);