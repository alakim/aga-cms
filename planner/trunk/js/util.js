define(["jquery", "html"], function($, $H) {
	function twoDigits(x){
		return x<10?"0"+x:x;
	}
	
	function getModelData(model, level){
		level = level || 0;
		if(level>3) return;
		if(typeof(model)!="object") return model;
		var res = {};
		for(var k in model){
			if(k.slice(0,1)!="$") continue;
			var v = model[k];
			if(typeof(v)=="function") v = v();
			if(v instanceof Array){
				var arr = [];
				for(var el,i=0; el=v[i],i<v.length; i++){
					arr.push(getModelData(el));
				}
				res[k.slice(1)] = arr;
			}
			else{
				if(v==null || v.length==0) continue;
				res[k.slice(1)] = getModelData(v, level+1);
			}
		}
		return res;
	}
	
	function validMsg(field){with($H){
		return span({"class":"validation", "data-bind":"text:"+field+".validationMessage"})
	}}
	

	
	return {
		wait: function(pnl){with($H){
			pnl.html(
				$H.img({src:"images/wait.gif"})
			);
		}},
		log: function(msg, logMsg){with($H){
			if(logMsg){
				$(logMsg).append(span({style:"padding-left:5px;"}, msg));
			}
			else{
				logMsg = $(div(msg));
				$("div.console").append(logMsg);
			}
			return logMsg;
		}},
		formatDate: function(date){
			var Y = date.getFullYear(),
				M = date.getMonth(),
				D = date.getDate(),
				h = date.getHours(),
				m = date.getMinutes();
			var res = [Y,twoDigits(M+1),twoDigits(D)].join("-");
			res+="T"+[twoDigits(h), twoDigits(m)].join(":");
			return res;
		},
		getDictSize: function(dict){
			var i=0;
			for(var k in dict) i++;
			return i;
		},
		getModelData: getModelData,
		validMsg: validMsg
	};
});