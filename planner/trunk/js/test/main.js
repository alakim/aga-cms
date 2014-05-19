requirejs.config({
    baseUrl: "js",
    paths: {
		jquery: "lib/jquery-1.11.0.min",
		html:"lib/html",
		jspath:"lib/jspath",
		jsflow:"lib/jsflow",
		knockout:"lib/knockout-3.1.0",
		dataSource: "test/dataSource",
		common:"forms/common"
    },
	urlArgs: "bust=" + (new Date()).getTime(),
	shim:{
		"html":{exports:"Html"},
		"jspath":{exports:"JsPath"},
		"jsflow":{exports:"JSFlow"}
	}
});

requirejs(["jquery", "html", "test/dsTests", "forms/common", "db"], function($, $H, dsTests, common, db) {
		//$("#out").html("Tests are performed!");
		
		
		var mainPnl = $("#out");
		common.wait(mainPnl);
		db.loadData(function(){
			mainPnl.html("");
			dsTests.run();
		});
		
		
	}
);