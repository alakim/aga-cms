var Editor = (function(){
	//var pwd = "abcdef";
	
	

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
		password:null,
		docPath:null,
		secure: false,
		display: function(pnl, docPath, secure){
			$(pnl).html(Html.img({src:"core/wait.gif"}));
			$.post(__.ws.load, {path:docPath}, function(doc, state, data){
				var v = data.responseText;
				//console.log(secure, __.password);
				__.secure = secure && __.password;
				if(secure && __.password) v = decode(__.password, v);
				__.docPath = docPath;
				if(docPath.match(/\.txt$/i))
					$(pnl).textView(v);
				else{
					//console.log(v);
					var jsData = $.parseJSON(v);
					var view = __.selectView(jsData);
					$(pnl)[view](jsData);
				}
			});
		},
		save: function(path, data, onsuccess, secure, onerror){
			path = path || __.docPath;
			secure = secure==null?false:secure;
			//console.log(secure, __.password);
			var textMode = path.match(/\.txt$/i);
			var json = textMode?data:JSON.stringify(data);
			var v = secure && __.password?encode(__.password, json):json;
			$.post(__.ws.save, {path:path, data:v}, function(doc, state, data){
				$.post(__.ws.load, {path:path}, function(doc, state, data){
					var v = data.responseText;
					if(secure && __.password) v = decode(__.password, v);
					if(v==json) onsuccess();
					else onerror?onerror():alert("Data saving error!");
				});
			});
		},
		selectView: function(doc){
			return "defaultView";
		},
		backup: function(dirPath, onbackup){
			$.post(__.ws.backup, {d:dirPath}, function(doc, state, data){
				var json = JSON.stringify(data);
				onbackup(json);
			});
		}
	};
	
	return __;
})();