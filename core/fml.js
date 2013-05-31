var FML = (function(){
	var __ = {
		parse: function(code, includes, args){
			includes = includes?includes.split(";"):[];
			args = args || "";
			var fcode = [];
			$.each(includes, function(i, inc){
				fcode.push(["with(", inc, "){"].join(""));
			});
			fcode = fcode.concat(["return ", code]);
			for(var i=0; i<includes.length; i++)
				fcode.push("}");
			fcode = fcode.join("");
			return new Function(args, fcode);
		}
	};
	
	return __;
})();