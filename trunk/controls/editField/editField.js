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
			var vFld = eFld.show()
				.find(".valField");
			vFld.width(el.width())
				.val(JsPath.get(doc, path));
			vFld[0].focus();
		});
		var eFld = el.next(".editField");
		eFld.find(".btOK").click(function(){var _=$(this);
			var fld = _.parent();
			JsPath.set(doc, path, fld.find(".valField").val());
			fld.hide().prev().html(JsPath.get(doc, path)).show();
		});
		eFld.find(".btCancel").click(function(){var _=$(this);
			var fld = _.parent();
			fld.hide().prev().html(JsPath.get(doc, path)).show();
		});
	}
	
	$.fn.editField = function(doc){
		$(this).each(function(i, el){
			buildField($(el), doc);
		});
	};
})(jQuery, Html);