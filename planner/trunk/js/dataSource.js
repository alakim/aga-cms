define(["jspath", "cdk", "util"], function($JP, Cdk, util){
	
	var cdk;
	
	function encode(val){
		return cdk.ec(val);
	}
	
	function decode(val){
		return cdk.ec(val, true);
	}

	return {
		load: function(file, arrMode, onload){
			cdk = new Cdk($(".key").val());
			var log = util.log("loading " + file + " ...");
			$.post("ws/load.php", {path:file}, function(res){
				if(res==null || res.length==0) res = arrMode?"[]":"{}";
				else res = decode(res);
				var data = $.parseJSON(res);
				onload(data);
				util.log("OK", log);
			});

		},
		save: function(path, data, onsave){
			cdk = new Cdk($(".key").val());
			var log = util.log("saving "+path+" ...");
			var json = JSON.stringify(data);
			$.post("ws/save.php", {path:path, data:encode(json)}, function(res){
				util.log("OK", log);
				onsave();
			});
		},
		backupData: function(onbackup){
			var backupUrl = "http://www.back.ru/sss/s.zip";
			$.post("ws/archive.php", {n:"dataBackup", d:"../data"}, function(res){
				res = $.parseJSON(res);
				if(res.error){
					alert(res.error);
					return;
				}
				onbackup(res.archive);
			});
		}
	};
});