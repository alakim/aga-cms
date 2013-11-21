﻿(function($,H, $R){	var rowHeight = 18,		padding = 5;		function getRowsCount(doc){		return doc.length;	}		function getDays(dateString){		dateString = dateString.replace("~","");		var y, m, d;		if(dateString=="now"){			var nn = new Date();			y = nn.getFullYear();			m = nn.getMonth()+1;			d = nn.getDate();		}		else{			var arr = dateString.split(".");			arr.reverse();			y = parseInt(arr[0], 10);			m = arr.length>1? parseInt(arr[1], 10) : 1;			d = arr.length>2? parseInt(arr[2], 10) : 1;		}		var mDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];		function days(m){			var res = 0;			for(var i=1; i<m; i++) res+=mDays[i];			return res;		}		return y*365+days(m)+d;	}		function getTimeRange(doc){		var res = {};		function addDate(dateString){			var days = getDays(dateString);			if(res.min==null || res.min>days) res.min = days;			if(res.max==null || res.max<days) res.max = days;		}				$.each(doc, function(i, row){			if(row.date)				addDate(row.date);			else if(row.begin){				addDate(row.begin);				addDate(row.end);			}		});		return res;	}		function buildView(el, doc){		var width = $(el).width() - padding*2;		var data = doc.data || doc;		var options = doc.options || {};		options = $.extend({			rowDotsInterval: 365,			colors:{},			grid:null		}, options);		var range = getTimeRange(data);		var dx = width/(range.max-range.min);				var chartHeight = rowHeight*(getRowsCount(data)+(options.grid?1:0));		$(el).css({height:chartHeight});		var cnv = $R(el);		drawGrid(cnv, options.grid, range, width, chartHeight, dx);		$.each(data, function(i, row){			drawRow(cnv, row, i, options.grid?rowHeight:0, width, range, dx, options);		});	}		function roma(i){		var R = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];		var C = ["", "X", "XX", "XXX"];		var c = Math.floor(i/10);		var r = i%10;		return C[c]+R[r];	}		function drawGrid(cnv, grid, range, width, height, dx){		if(!grid) return;		if(grid=="ages"){			var year = 365;			var age = year*100;			var start = (age+year-range.min%age)*dx+padding;			var startLabel = Math.ceil(range.min/age)+1;			for(var i=0,x = start; x<width; i++,x+=age*dx){				var label = startLabel+i;				cnv.rect(x, 0, 1, height).attr({"stroke-width":0, fill:"#ddd"});				cnv.text(x+age*dx/2, 5, roma(label));			}		}	}		function drawRowDots(cnv, x, y, w, dx, options){		var dotSize = {h:3, w:1};		var step = options.rowDotsInterval*dx;		for(var i=0; i*step<w; i++){			var dotH = dotSize.h*(i%10==0?3:i%5==0?2:1);			cnv.rect(x+i*step, y+rowHeight-dotH, dotSize.w, dotH).attr({"stroke-width":0, fill:"#008"});		}	}		function getFill(color, begin, end){		if(!begin) return color;		var re = /^\~/;		var grad = [0];		if(begin.match(re)) grad.push("#fff");		grad.push(color);		if(end.match(re)) grad.push("#fff");		return grad.join("-");	}		function drawRow(cnv, row, idx, yOffset, width, range, dx, options){		var textMargin = 3, 			xCorrection = .5,			minWidth = 3,			collapsedMode = false,			year = 365,			glowWidth = 20;		var x = row.date?(getDays(row.date)-range.min)*dx				:row.begin?(getDays(row.begin)-range.min)*dx				:0,			w = row.end?(getDays(row.end) - getDays(row.begin))*dx				:minWidth,			y = rowHeight*idx + yOffset;					x+=xCorrection;		w-=xCorrection;		x+=padding;		if(row.begin && w<minWidth){			w = minWidth;			collapsedMode = true;		};				var color = row.color||"#ccc";		var mt = color.match(/^\$(.+)/);		if(mt) color = options.colors[mt[1]];				if(row.nearMode){			cnv.rect(w>minWidth+glowWidth?x+glowWidth/2:x, y+glowWidth/2, w>minWidth+glowWidth?w-glowWidth:w, rowHeight-glowWidth)				.attr({					fill:color,					"stroke-width":0,					opacity:.1,					title:row.date || (row.begin+" - "+row.end)				})				.glow({width:glowWidth, fill:true, color:color});		}		else{			var rect = cnv.rect(x, y, w, rowHeight)				.attr({					fill: getFill(color, row.begin, row.end),					"stroke-width":0,					title:row.date || (row.begin+" - "+row.end)				});			if(row.activity && !collapsedMode){				var title = row.activity.name,					bgn = title? row.activity.begin : row.activity[0],					end = title? row.activity.end : row.activity[1],					ax = (getDays(bgn) - range.min)*dx+xCorrection+padding,					aw = (getDays(end) - getDays(bgn))*dx;				rect.attr({opacity:.5});				cnv.rect(ax, y, aw, rowHeight)					.attr({						fill:color,						"stroke-width":0,						title:(title?title+": ":"")+bgn+" - "+end					});			}		}		if(row.end && !collapsedMode) drawRowDots(cnv, x, y, w, dx, options);		var txt = cnv.text(0, y+rowHeight/2, row.name).attr({"text-anchor":"start"});		var textX = x<width/2? x+w+textMargin			:x - txt.getBBox().width - textMargin;		if(row.nearMode) textX+=(x<width/2?1:-1)*glowWidth/2;		txt.attr({x:textX});	}	$.fn.timelineView = function(tlDoc){		var doc = $.parseJSON(tlDoc);		$(this).each(function(i, el){			$(el).html("");			buildView(el, doc);		});	}})(jQuery, Html, Raphael);