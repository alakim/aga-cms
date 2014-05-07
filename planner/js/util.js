define([], function() {
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
			if(v==null) continue;
			res[k.slice(1)] = getModelData(v, level+1);
		}
		return res;
	}
	
	return {
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
		getModelData: getModelData
	};
});