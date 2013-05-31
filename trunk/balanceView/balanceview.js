(function($,H){

	function buildView(pnl, jsonDoc){
		var doc = $.parseJSON(jsonDoc);
		function template(){with(H){
			var counter = 0, sum = 0;
			return table({border:1, cellpadding:3, cellspacing:0},
				tr(
					th("Date"),
					th("Amount"),
					th("Notes"),
					th("Sum")
				),
				apply(doc.items, function(itm){
					var sum = counter+=itm.amount;
					if(itm.calcSum) counter = 0;
					return tr(
						td(itm.date),
						td(itm.amount),
						td(itm.notes),
						td(itm.calcSum?sum:"...")
					);
				})
			);
		}}
		
		pnl.html(template());
	}
	
	$.fn.balanceView = function(jsonDoc){
		$(this).each(function(i, pnl){
			buildView($(pnl), jsonDoc);
		});
	};
})(jQuery, Html);