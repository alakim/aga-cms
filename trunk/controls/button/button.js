(function($,H){
	$.fn.button = function(){
		$(this).each(function(i, itm){itm=$(itm);
			switch(itm[0].tagName.toUpperCase()){
				case "SPAN":
					var txt = itm.text();
					itm.html(H.markup(
						txt,
						H.span({"class":"right"})
					));
					break;
				case "IMG":
					itm.attr({src:"null.gif"});
					break;
				default:
					break;
			}
			
			itm
				.mouseover(function(){$(this).addClass("highlight");})
				.mouseout(function(){$(this).removeClass("highlight");});
		});
	};
})(jQuery,Html);