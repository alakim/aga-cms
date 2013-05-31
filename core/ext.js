(function($){
	function formatInt(i){
		return i<10?"0"+i:i.toString();
	}
	
	$.extend(Date.prototype, {
		toStdString: function(){
			var y = this.getFullYear(),
				mn = formatInt(this.getMonth()+1),
				d = formatInt(this.getDate()),
				h = formatInt(this.getHours()),
				m = formatInt(this.getMinutes());
			return [
				[y,mn,d].join("-"),
				[h,m].join(":")
			].join("T");
		}
	});
	
	$.extend(String.prototype, {
		normalize: function(){
			return this.replace(/^\s+/, "").replace(/\s+$/, "").replace(/\s+/g, " ");
		}
	});
})(jQuery);