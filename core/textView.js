(function($,H){
	
	function toHtml(str){
		str = str
			.replace(/&/ig, "&amp;")
			.replace(/</ig, "&lt;")
			.replace(/>/ig, "&gt;");
			
		str = str.split("\n");
		for(var i=0; i<str.length; i++){var ln = str[i];
			var mt = ln.match(/^( *)/);
			if(mt){
				var indent = mt[1];
				indent = indent.replace(/ /g, "&nbsp;");
				str[i] = str[i].replace(/^ */, indent);
			}
		}
		str = str.join("\n");
		return str
			.replace(/\n/ig, Html.br())
			.replace(/\t/ig, "&nbsp;&nbsp;&nbsp;&nbsp;");
	}
	var templates = {
		main: function(doc, editMode){with(Html){
			return markup(
				div({"class":"editPnl"},
					input({type:"button", "class":"btnEdit", value:editMode?"View mode":"Edit mode"}),
					editMode?markup(
						input({type:"button", "class":"btnSave", value:"Save"}),
						" file name:",
						input({type:"text", "class":"fldFileName", value:Editor.docPath}),
						" encode",
						input({type:"checkbox", "class":"cbEncode"}, Editor.secure?{checked:true}:null)
					):null
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
			var filePath = $(".editPnl .fldFileName").val();
			var encode = $(".editPnl .cbEncode")[0].checked;
			// console.log(filePath, ", ", encode);
			// return;
			//console.log("saved: ", doc); return;
			Editor.save(filePath, doc, function(){
				alert("Saved "+filePath);
			}, encode, function(){
				alert("Error saving file "+filePath);
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