(function($,H){
	
	function buildField(el, doc, buttonType){
		var path = el.attr("path")
		
		function template(){with(H){
			var val = JsPath.get(doc, path);
			return span({"class":"editField"},
				input({type:"text", "class":"valField", style:style({width: el.width()}), value: val}),
				buttonType=="text"?markup(
					span({"class":"button btOK"}, "OK"),
					span({"class":"button btCancel"}, "Cancel")
				)
				:buttonType=="icon"?div({style:"display:inline;position:relative;top:4"},
					img({"class":"button btOK"}),
					img({"class":"button btCancel"})
				)
				:markup(
					input({type:"button", "class":"btOK", value:"OK"}),
					input({type:"button", "class":"btCancel", value:"Cancel"})
				)
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
		if(buttonType!="html"){
			eFld.find(".button").button();
		}
		eFld.find(".btOK").click(function(){var _=$(this);
			var fld = _.parents(".editField");
			JsPath.set(doc, path, fld.find(".valField").val());
			fld.hide().prev().html(JsPath.get(doc, path)).show();
		});
		eFld.find(".btCancel").click(function(){var _=$(this);
			var fld = _.parents(".editField");
			fld.hide().prev().html(JsPath.get(doc, path)).show();
		});
	}
	
	$.fn.editField = function(doc, buttonType){
		buttonType = buttonType||"html";
		$(this).each(function(i, el){
			buildField($(el), doc, buttonType);
		});
	};
})(jQuery, Html);