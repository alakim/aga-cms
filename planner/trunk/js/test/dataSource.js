define(["jspath", "test/dbData"], function($JP, dbData){
	var timeout = 100;
	
	return {
		load: function(file, onload){
			setTimeout(function(){
				var path = file;
				var data = $JP.get(dbData, path);
				onload(data);
			}, timeout);
		}
	};
});