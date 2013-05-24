(function($,H){
	function normalizeDoc(doc){
		$.each(doc.items, function(i, itm){
			if(!itm.tags) itm.tags = [];
			if(typeof(itm.tags)=="string") itm.tags = itm.tags.split(";");
			itm.tags = itm.tags.sort();
		});
	}
	
	function normalizeString(str){
		return str.replace(/^\s+/, "").replace(/\s+$/, "").replace(/\s+/g, " ");
	}
	
	function updateView(pnl, doc, selectedTags){
		selectedTags = selectedTags || [];
		var tagDict = {};
		$.each(selectedTags, function(i, tag){tagDict[tag] = true;});
		
		function checkTags(itm){
			if(!selectedTags.length) return true;
			for(var i=0; i<itm.tags.length; i++){
				if(tagDict[itm.tags[i]]) return true;
			}
			return false;
		}
		
		function template(){with(H){
			return table(
				apply(doc.items, function(itm){
					return checkTags(itm)?tr(
						td(
							apply(itm.tags, function(tag){
								return span(tag);
							}, ", ")
						),
						td(a({href:itm.url}, itm.label)),
						td(itm.dsc)
					):null;
				})
			);
		}}
		pnl.find(".viewPanel").html(template());
	}

	function buildView(pnl, jsDoc){
		var doc = $.parseJSON(jsDoc);
		normalizeDoc(doc);
		
		function template(){with(H){
			return div({"class":"lcatView"},
				div({"class":"buttonsPnl"},
					input({type:"button", "class":"btEdit", value:"Edit View"}),
					input({type:"button", "class":"btAddItem", value:"Add Item"})
				),
				div({"class":"pnlAdd", style:"display:none;"},
					div("tags: ", input({type:"text", "class":"fldTags", style:"width:250px;"})),
					div(
						" url: ", input({type:"text", "class":"fldUrl", style:"width:250px;"}),
						" label: ", input({type:"text", "class":"fldLabel", style:"width:250px;"})
					),
					div(" description: ", input({type:"text", "class":"fldDsc", style:"width:700px;"})),
					div(
						input({type:"button", "class":"btOK", value:"OK"}),
						input({type:"button", "class":"btCancel", value:"Cancel"})
					)
				),
				div({"class":"tagsPanel"}),
				div({"class":"viewPanel"})
			);
		}}
		
		var view = $(template());
		pnl.html(view);
		
		pnl.find(".buttonsPnl .btEdit").click(function(){var _=$(this);
			if(pnl.find(".fldDoc").length){
				_.attr({value:"Edit view"});
				updateView(pnl, doc);
			}
			else{
				_.attr({value:"View mode"});
				pnl.find(".viewPanel").textEditor(formatJson(doc));
			}
		});
		pnl.find(".buttonsPnl .btAddItem").click(function(){var _=$(this);
			pnl.find(".pnlAdd").slideDown();
		});
		pnl.find(".pnlAdd .btCancel").click(function(){pnl.find(".pnlAdd").slideUp();});

		pnl.find(".pnlAdd .btOK").click(function(){
			var tags = normalizeString(pnl.find(".pnlAdd .fldTags").val());
			var url = normalizeString(pnl.find(".pnlAdd .fldUrl").val());
			var label = normalizeString(pnl.find(".pnlAdd .fldLabel").val());
			var dsc = normalizeString(pnl.find(".pnlAdd .fldDsc").val());
			
			var itm = {url:url, label:label};
			if(tags.length) itm.tags = tags.split(";").sort();
			if(dsc.length) itm.dsc = dsc;
			doc.items.push(itm);
			
			updateView(pnl, doc);
			pnl.find(".pnlAdd").slideUp();
		});

		
		
		
		updateView(view, doc);
		
		view.find(".tagsPanel").tagPanel(doc.items, function(selectedTags){
			updateView(pnl, doc, selectedTags);
		});
	}
	
	function formatJson(doc){
		var jsCode = ["{\"items\":["];
		var itmLines = [];
		$.each(doc.items, function(i, itm){
			var line = [];
			line.push("\t{");
			line.push("\"url\":\""+JSON.stringify(itm.url)+"\",");
			line.push("\"label\":\""+JSON.stringify(itm.label)+"\"");
			if(itm.dsc) line.push(",\"dsc\":\""+JSON.stringify(itm.dsc)+"\"");
			if(itm.tags.length) line.push(",\"tags\":\""+itm.tags.join(";")+"\"");
			line.push("}");
			
			itmLines.push(line.join(""));
		});
		jsCode.push(itmLines.join(",\n"));
		jsCode.push("]}");
		return jsCode.join("\n");
	}
	
	$.fn.lcatView = function(jsDoc){
		$(this).each(function(i, el){
			buildView($(el), jsDoc);
		});
	};
})(jQuery, Html);