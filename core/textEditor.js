(function($,H){

	function buildEditor(pnl, doc, onchange){
		function template(){with(H){
			return div(
				div(
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
			var filePath = $(".editPnl .fldFileName").val();
			var encode = $(".editPnl .cbEncode")[0].checked;
			Editor.save(filePath, doc, function(){
				alert("Saved "+filePath);
			}, encode, function(){
				alert("Error saving file "+filePath);
			});
		});
		editPnl.find("textarea.fldDoc").change(function(){
			var v = $(this).val();
			onchange(v);
		});

	}
	
	$.fn.textEditor = function(doc, onchange){
		$(this).each(function(i, pnl){
			buildEditor($(pnl), doc, onchange);
		});
	};

	
})(jQuery, Html);