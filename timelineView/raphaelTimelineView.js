﻿(function($,H, $R){	var rowHeight = 18,		padding = 5;		function getRowsCount(doc){		return doc.length;	}		function getDays(dateString){		var y, m, d;		if(dateString=="now"){			var nn = new Date();			y = nn.getFullYear();			m = nn.getMonth()+1;			d = nn.getDate();		}		else{			var arr = dateString.split(".");			arr.reverse();			y = parseInt(arr[0], 10);			m = arr.length>1? parseInt(arr[1], 10) : 1;			d = arr.length>2? parseInt(arr[2], 10) : 1;		}		var mDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];		function days(m){			var res = 0;			for(var i=1; i<m; i++) res+=mDays[i];			return res;		}		return y*365+days(m)+d;	}		function getTimeRange(doc){		var res = {};		function addDate(dateString){			var days = getDays(dateString);			if(res.min==null || res.min>days) res.min = days;			if(res.max==null || res.max<days) res.max = days;		}				$.each(doc, function(i, row){			if(row.date)				addDate(row.date);			else if(row.begin){				addDate(row.begin);				addDate(row.end);			}		});		return res;	}		function buildView(el, doc){		var width = $(el).width() - padding*2;		var data = doc.data || doc;		var options = doc.options || {};		options = $.extend({			rowDotsInterval: 365 		}, options);		var range = getTimeRange(data);		var dx = width/(range.max-range.min);				$(el).css({height:rowHeight*getRowsCount(data)});		var cnv = $R(el);		$.each(data, function(i, row){			drawRow(cnv, row, i, width, range, dx, options);		});	}		function drawRowDots(cnv, x, y, w, dx, options){		var dotSize = {h:3, w:1};		var step = options.rowDotsInterval*dx;		for(var i=0; i*step<w; i++){			var dotH = dotSize.h*(i%10==0?3:i%5==0?2:1);			cnv.rect(x+i*step, y+rowHeight-dotH, dotSize.w, dotH).attr({"stroke-width":0, fill:"#008"});		}	}		function drawRow(cnv, row, idx, width, range, dx, options){		var textMargin = 3, 			xCorrection = .5;		var x = row.date?(getDays(row.date)-range.min)*dx				:row.begin?(getDays(row.begin)-range.min)*dx				:0,			w = row.end?(getDays(row.end) - getDays(row.begin))*dx				:3,			y = rowHeight*idx;					x+=xCorrection;		w-=xCorrection;		x+=padding;				var color = row.color||"#ccc";		var mt = color.match(/^\$(.+)/);		if(mt) color = options.colors[mt[1]];				cnv.rect(x, y, w, rowHeight)			.attr({				fill:color,				"stroke-width":0,				title:row.date || (row.begin+" - "+row.end)			});		if(row.end) drawRowDots(cnv, x, y, w, dx, options);		var txt = cnv.text(0, y+rowHeight/2, row.name).attr({"text-anchor":"start"});		var textX = x<width/2? x+w+textMargin			:x - txt.getBBox().width - textMargin;		txt.attr({x:textX});	}	$.fn.timelineView = function(tlDoc){		var doc = $.parseJSON(tlDoc);		$(this).each(function(i, el){			$(el).html("");			buildView(el, doc);		});	}})(jQuery, Html, Raphael);