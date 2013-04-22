(function($,H){
	
	function toHtml(str){
		return str
			.replace(/\n/ig, Html.br())
			.replace(/\t/ig, "&nbsp;&nbsp;&nbsp;&nbsp;");
	}
	var templates = {
		main: function(doc, editMode){with(Html){
			return markup(
				div({"class":"editPnl"},
					input({type:"button", "class":"btnEdit", value:editMode?"View mode":"Edit mode"}),
					editMode?input({type:"button", "class":"btnSave", value:"Save"}):null
				),
				editMode?div(
					textarea({"class":"fldDoc", style:"width:550px; height:350px;"}, doc)
				):div(toHtml(doc))
			);
		}}
	};

	function buildView(pnl, doc, editMode){
		pnl.html(templates.main(doc, editMode));
		$(".editPnl .btnEdit").click(function(){
			buildView(pnl, doc, !editMode);
		});
		$(".editPnl .btnSave").click(function(){
			//console.log("saved: ", doc); return;
			Editor.save(null, doc, function(){
				alert("Saved "+Editor.docPath);
			}, false, function(){
				alert("Error saving file "+Editor.docPath);
			});
		});
		$("textarea.fldDoc").change(function(){
			doc = $(this).val();
		});
		
	}
	
	$.fn.textView = function(doc){
		$(this).each(function(i, pnl){
			buildView($(pnl), doc, false);
		});
	};

	
})(jQuery, Html);