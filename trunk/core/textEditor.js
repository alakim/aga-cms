(function($,H){

	function buildEditor(pnl, doc, onchange){
		function template(){with(H){
			return div(
				div({"class":"buttonsPnl"},
					input({type:"button", "class":"btnSave", value:"Save"}),
					" file name:",
					input({type:"text", "class":"fldFileName", value:Editor.docPath}),
					" encode",
					input({type:"checkbox", "class":"cbEncode"}, Editor.secure?{checked:true}:null)
				),
				div(
					textarea({"class":"fldDoc", style:"width:550px; height:350px;"}, doc)
				)
			);
		}}
		var editPnl = $(template());
		pnl.html(editPnl);
		
		editPnl.find(".btnSave").click(function(){
			var filePath = editPnl.find(".buttonsPnl .fldFileName").val();
			var encode = editPnl.find(".buttonsPnl .cbEncode")[0].checked;
			var v = editPnl.find("textarea.fldDoc").val();
			Editor.save(filePath, v, function(){
				alert("Saved "+filePath);
			}, encode, function(){
				alert("Error saving file "+filePath);
			}, true);
		});
		editPnl.find("textarea.fldDoc").change(function(){
			var v = $(this).val();
			if(onchange) onchange(v);
		});

	}
	
	$.fn.textEditor = function(doc, onchange){
		$(this).each(function(i, pnl){
			buildEditor($(pnl), doc, onchange);
		});
	};

	
})(jQuery, Html);