define(["jspath", "cdk", "util"], function($JP, Cdk, util){
	
	var cdk;
	var tooLargeFileSize = 150000;
	
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
			$.post("ws/load.php", {path:file}, function(resp){
				resp = $.parseJSON(resp);
				var res = resp.data;
				
				if(res==null || res.length==0) res = arrMode?"[]":"{}";
				else res = decode(res);
				try{
					var data = $.parseJSON(res);
				}
				catch(e){
					console.log("Error parsing JSON ", res);
				}
				onload(data);
				resp.size = "<span style='"+(resp.size>tooLargeFileSize?"color:red;":"")+"'>"+resp.size+" bytes</span>";
				util.log(resp.size+": OK", log);
			});

		},
		save: function(path, data, onsave){
			cdk = new Cdk($(".key").val());
			var log = util.log("saving "+path+" ...");
			var json = JSON.stringify(data);
			json = json.replace(/\s*\t+\s*/g, " ");
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