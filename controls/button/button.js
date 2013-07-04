(function($,H){
	$.fn.button = function(){
		$(this).each(function(i, itm){itm=$(itm);
			if(itm[0].tagName.toUpperCase()=="SPAN"){
				var txt = itm.text();
				itm.html(H.markup(
					txt,
					H.span({"class":"right"})
				));
			}
			itm
				.mouseover(function(){$(this).addClass("highlight");})
				.mouseout(function(){$(this).removeClass("highlight");});
		});
	};
})(jQuery,Html);