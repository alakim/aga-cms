(function($,H){

	function buildView(pnl, jsonDoc){
		var doc = $.parseJSON(jsonDoc);
		function template(){with(H){
			return div({"class":"balanceView"},
				div({"class":"buttonsPnl"},
					input({type:"button", "class":"btEdit", value:"Edit View"}),
					input({type:"button", "class":"btAddItem", value:"Add Item"})
				),
				div({"class":"pnlAdd", style:"display:none;"},
					div(
						"date: ", input({type:"text", "class":"fldDate", style:"width:250px;"}),
						" amount: ", input({type:"text", "class":"fldAmount", style:"width:250px;"}),
						" calcSum: ", input({type:"checkbox", "class":"cbCalcSum"})
					),
					div(
						" notes: ", input({type:"text", "class":"fldNotes", style:"width:650px;"})
					),
					div(
						input({type:"button", "class":"btOK", value:"OK"}),
						input({type:"button", "class":"btCancel", value:"Cancel"})
					)
				),
				div({"class":"viewPanel"})
			);
		}}
		
		pnl.html(template());
		pnl.find(".buttonsPnl .btEdit").click(function(){var _=$(this);
			if(pnl.find(".fldDoc").length){
				_.attr({value:"Edit view"});
				doc = $.parseJSON(pnl.find(".fldDoc").val());
				updateView(pnl, doc);
			}
			else{
				_.attr({value:"View mode"});
				pnl.find(".viewPanel").textEditor(formatJson(doc));
			}
		});

		pnl.find(".buttonsPnl .btAddItem").click(function(){
			pnl.find(".fldDate").val((new Date()).toStdString());
			pnl.find(".pnlAdd").slideDown();
		});
		pnl.find(".btOK").click(function(){
			var date = pnl.find(".fldDate").val(),
				amount = pnl.find(".fldAmount").val(),
				calcSum = pnl.find(".cbCalcSum")[0].checked,
				notes = pnl.find(".fldNotes").val();
			var itm = {date:date, amount:amount.length?parseInt(amount):0};
			if(calcSum) itm.calcSum = true;
			if(notes.length) itm.notes = notes;
			
			doc.items.push(itm);
			
			pnl.find(".pnlAdd").slideUp();
			updateView(pnl, doc);
		});
		pnl.find(".btCancel").click(function(){
			pnl.find(".pnlAdd").slideUp();
		});
		
		updateView(pnl, doc);
	}
	
	function updateView(pnl, doc){
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
		
		pnl.find(".viewPanel").html(template());
	}
	
	function formatJson(doc){
		var jsCode = ["{\"items\":["];
		var itmLines = [];
		$.each(doc.items, function(i, itm){
			var line = [];
			line.push("\t{");
			line.push("\"date\":"+JSON.stringify(itm.date)+",");
			line.push("\"amount\":"+itm.amount);
			if(itm.notes) line.push(",\"notes\":"+JSON.stringify(itm.notes));
			if(itm.calcSum) line.push(",\"calcSum\":true");
			line.push("}");
			
			itmLines.push(line.join(""));
		});
		jsCode.push(itmLines.join(",\n"));
		jsCode.push("]}");
		return jsCode.join("\n");
	}

	$.fn.balanceView = function(jsonDoc){
		$(this).each(function(i, pnl){
			buildView($(pnl), jsonDoc);
		});
	};
})(jQuery, Html);