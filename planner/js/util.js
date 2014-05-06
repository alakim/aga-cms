define([], function() {
	function twoDigits(x){
		return x<10?"0"+x:x;
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
		}
	};
});