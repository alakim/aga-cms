(function($,H){
	function template(){with(H){
		return div({style:style({"text-align":"right", "margin-right":40})},
			a({href:"#", "class":"btExpandAll"}, "Expand all"), " | ",
			a({href:"#", "class":"btCollapsePages"}, "Collapse pages"), " | "
		);
	}}
	
	function buildPanel(pnl){
		pnl.html(template());
		
		pnl.find(".btExpandAll").click(function(){$(".section2").show();});
		pnl.find(".btCollapsePages").click(function(){$(".section2").hide();});
	}
	
	$.fn.tocControls = function(){
		$(this).each(function(i, el){
			buildPanel($(el));
		});
	};
	
	$(function(){
		$("#controlPnl").tocControls();
		$(".section2").hide();
	});
})(jQuery, Html);