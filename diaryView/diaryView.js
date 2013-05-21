(function($,H){
	var getWeekDay = (function(){
		var days = "Âñ,Ïí,Âò,Ñð,×ò,Ïò,Ñá".split(",");
		return function(y,m,d){
			y = parseInt(y, 10);
			m = parseInt(m, 10);
			d = parseInt(d, 10);
			return days[new Date(y, m-1, d).getDay()];
		}
	})();
	
	function getSortedKeys(o){
		var keys = [];
		for(var k in o){
			keys.push(parseInt(k, 10));
		}
		keys = keys.sort(function(x, y){return x>y?1:x<y?-1:0;});
		for(var i=0; i<keys.length; i++)
			keys[i] = keys[i].toString();
		return keys;
	}
	
	function sortByTime(d){
		return d.sort(function(x, y){
			return x.t>y.t?1:x.t<y.t?-1:0;
		});
	}
	
	function formatTime(h, m){
		if(typeof(h)=="string") h = parseInt(h);
		if(typeof(m)=="string") m = parseInt(m);
		if(h<10) h = "0"+h;
		if(m<10) m = "0"+m;
		return [h,m].join(":");
	}
	
	function buildView(el, jsDoc){
		var doc = $.parseJSON(jsDoc);
		var tagDict = {};
		collectTags(doc);
		var tags = [];
		for(var k in tagDict) tags.push(k);
		tags.sort();
		
		var selectedTags = {};
		
		function checkTags(tList){
			if(!tList) return noTagsSelected();
			for(var i=0; i<tList.length; i++){
				if(selectedTags[tList[i]]) return true;
			}
			return noTagsSelected();
		}
		function noTagsSelected(){
			for(var k in selectedTags){
				if(selectedTags[k]) return false;
			}
			return true;
		}
		
		function collectTags(nd){
			if(nd instanceof Array){
				$.each(nd, function(i, itm){
					if(!itm.tags) return;
					itm.tags = itm.tags.split(";");
					$.each(itm.tags, function(j, t){
						tagDict[t] = true;
					});
				})
			}
			else{
				for(var k in nd) collectTags(nd[k]);
			}
		}
		
		var templates = {
			tagList: function(doc){with(H){
				return div({"class":"tagList"},
					apply(tags, function(t){
						return a({href:"#"}, selectedTags[t]?{"class":"selected"}:null, t);
					}, " ")
				);
			}},
			main:function(doc){with(H){
				var addDlgWidth = 600,
					timeFldWidth = (addDlgWidth-200)/4;
				return div(
					div({"class":"buttonsPnl"},
						input({type:"button", "class":"btEdit", value:"Edit View"}),
						input({type:"button", "class":"btAddItem", value:"Add Item"})
					),
					div({"class":"pnlAdd", style:"display:none;"},
						input({type:"text", "class":"fldYear", style:style({width:timeFldWidth})}), ".",
						input({type:"text", "class":"fldMonth", style:style({width:timeFldWidth})}), ".",
						input({type:"text", "class":"fldDay", style:style({width:timeFldWidth})}), ":",
						input({type:"text", "class":"fldTime", style:style({width:timeFldWidth})}),
						input({type:"button", "class":"btNow", value:"Now"}),
						
						div(input({type:"text", "class":"fldTags", style:style({width:addDlgWidth})})),
						div(textarea({"class":"fldTxt", style:style({width:addDlgWidth, height:200})})),
						div(
							input({type:"button", "class":"btOK", value:"OK"}),
							input({type:"button", "class":"btCancel", value:"Cancel"})
						)
					),
					div({"class":"contentPnl"},
						templates.content(doc)
					)
				);
			}},
			content:function(doc){with(H){
				var years = getSortedKeys(doc);
				return div(
					templates.tagList(doc),
					apply(years, function(yNr){
						return templates.year(doc[yNr], yNr);
					})
				);
			}},
			year: function(y, yNr){with(H){
				var months = getSortedKeys(y);
				return div(
					h2(yNr),
					div({"class":"year"},
						apply(months, function(mNr){
							var m = y[mNr];
							return m?templates.month(m, mNr, yNr):null;
						})
					)
				);
			}},
			month: function(m, mNr, yNr){with(H){
				var days = getSortedKeys(m);
				if(mNr<10)mNr = "0"+mNr;
				return div({"class":"section"},
					h3(yNr, ".", mNr),
					div({"class":"month"},
						apply(days, function(dNr){
							var d = m[dNr];
							return d?templates.day(d, dNr, mNr, yNr):null;
						})
					)
				);
			}},
			day: function(d, dNr, mNr, yNr){with(H){
				if(dNr<10)dNr = "0"+dNr;
				return div({"class":"section"},
					h4(
						templates.weekDay(yNr, mNr, dNr), " ",
						[dNr, mNr, yNr].join(".")
					),
					div({"class":"day"},
						apply(sortByTime(d), function(evt){
							if(!checkTags(evt.tags)) return;
							return div({"class":"section event"},
								evt.t?span({"class":"time"}, evt.t, " "):null, 
								evt.tags?span({"class":"tagList"},
									"[",
									apply(evt.tags, function(eTg){
										return span(eTg);
									}, ", "),
									"] "
								):null,
								evt.txt
							);
						})
					)
				);
			}},
			weekDay: function(y,m,d){with(H){
				return getWeekDay(y,m,d);
			}}
		};
		
		function hideEmptySections(pnl){pnl=$(pnl);
			pnl.find(".day").each(function(i, d){d=$(d);
				if(!d.text().length)
					d.parent().html("");
			});
		}
		
		function buildPanels(){
			function setNow(){
				pnl.find(".pnlAdd .fldYear").val(1900+today.getYear());
				pnl.find(".pnlAdd .fldMonth").val(today.getMonth()+1);
				pnl.find(".pnlAdd .fldDay").val(today.getDate());
				pnl.find(".pnlAdd .fldTime").val(formatTime(today.getHours(), today.getMinutes()));
			}
			
			var pnl = $(templates.main(doc));
			el.html(pnl);
			pnl.find(".buttonsPnl .btEdit").click(function(){
				pnl.find(".contentPnl").textEditor(formatJson(doc));
			});
			pnl.find(".buttonsPnl .btAddItem").click(function(){
				pnl.find(".pnlAdd").slideDown();
			});
			pnl.find(".pnlAdd .btNow").click(setNow);
			var today = new Date();
			setNow();
			pnl.find(".pnlAdd .btCancel").click(function(){pnl.find(".pnlAdd").slideUp();});
			pnl.find(".pnlAdd .btOK").click(function(){
				var year = pnl.find(".pnlAdd .fldYear").val();
				var month = pnl.find(".pnlAdd .fldMonth").val();
				var day = pnl.find(".pnlAdd .fldDay").val();
				var time = pnl.find(".pnlAdd .fldTime").val();
				var tags = pnl.find(".pnlAdd .fldTags").val();
				var txt = pnl.find(".pnlAdd .fldTxt").val();
				if(txt.length){
					var itm = {};
					if(time.length) itm.t = time;
					if(tags.length) itm.tags = tags.split(";");
					itm.txt = txt;
					
					var path = [year, month, day].join("/")+"/#*";
					JsPath.set(doc, path, itm);
				}
				pnl.find(".pnlAdd .fldTags").val("");
				pnl.find(".pnlAdd .fldTxt").val("");
				updateView(pnl);
				pnl.find(".pnlAdd").slideUp();
			});
			updateView(pnl);
		}
		
		function updateView(pnl){
			var contPnl = $(templates.content(doc));
			pnl.find(".contentPnl").html(contPnl);
			hideEmptySections(contPnl);
			contPnl.find(".tagList a").click(function(){var _=$(this);
				var tag = _.text();
				selectedTags[tag] = !selectedTags[tag];
				updateView(pnl);
			});
		}
		
		buildPanels();
	}
	
	function formatJson(doc){
		function formatDay(day, indent){
			var js = [];
			day = sortByTime(day);
			for(var i=0; i<day.length; i++){var evt = day[i];
				var dd = {};
				$.extend(dd, evt);
				if(dd.tags) dd.tags = dd.tags.join(";");
				js.push(indent+"\t"+JSON.stringify(dd))
			}
			return "[\n"+js.join(",\n")+"\n"+indent+"]";
		}
		
		function formatSection(sect, indent){
			indent = indent || "";
			if(sect instanceof Array) return formatDay(sect, indent);
			var js = [];
			var keys = getSortedKeys(sect);
			$.each(keys, function(i, k){
				js.push(indent+"\t\""+k+"\":"+formatSection(sect[k], indent+"\t"));
			});
			js = js.join(",\n");
			return "{\n"+js+"\n"+indent+"}"
		}
		return formatSection(doc);
	}
	
	$.fn.diaryView = function(jsDoc){
		$(this).each(function(i, el){
			buildView($(el), jsDoc);
		});
	};
})(jQuery, Html);