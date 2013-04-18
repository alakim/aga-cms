var Editor = (function(){
	var pwd = "abc";
	
	

	function encode(pwd, val){
		var cdk = new Cdk(pwd);
		return cdk.ec(val);
	}
	
	function decode(pwd, val){
		var cdk = new Cdk(pwd);
		return cdk.ec(val, true);
	}

	var __={
		ws:{
			load: "load.php",
			save: "save.php",
			backup: "archive.php"
		},
		display: function(pnl, docPath, secure){
			$.post(__.ws.load, {path:docPath}, function(doc, state, data){
				var v = data.responseText;
				if(secure) v = decode(pwd, v);
				var jsData = $.parseJSON(v);
				var view = __.selectView(jsData);
				$(pnl)[view](jsData);
			});
		},
		save: function(path, data, onsuccess, secure, onerror){
			secure = secure==null?true:false;
			var json = JSON.stringify(data);
			var v = secure?encode(pwd, json):json;
			$.post(__.ws.save, {path:path, data:v}, function(doc, state, data){
				$.post(__.ws.load, {path:path}, function(doc, state, data){
					var v = data.responseText;
					if(secure) v = decode(pwd, v);
					if(v==json) onsuccess();
					else onerror?onerror():alert("Data saving error!");
				});
			});
		},
		selectView: function(doc){
			return "defaultView";
		},
		backup: function(dirPath){
			$.post(__.ws.backup, {d:dirPath}, function(doc, state, data){
				var json = JSON.stringify(data);
				if(json.archive)
					alert("Backup done. Load '"+json.archive+"' file.");
				if(json.error)
					alert(json.error);
			});
		}
	};
	
	return __;
})();