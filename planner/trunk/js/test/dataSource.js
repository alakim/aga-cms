define(["jspath", "test/dbData"], function($JP, dbData){
	var timeout = 300;
	
	return {
		load: function(file, onload){
			setTimeout(function(){
				var path = file;
				var data = $JP.get(dbData, path);
				var json = JSON.stringify(data);
				var d2 = $.parseJSON(json);
				onload(d2);
			}, timeout);
		},
		save: function(path, data, onsave){
			var json = JSON.stringify(data);
			$JP.set(dbData, path, $.parseJSON(json));
			setTimeout(onsave, timeout);
		}
	};
});