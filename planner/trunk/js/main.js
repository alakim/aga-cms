requirejs.config({
    baseUrl: "js",
    paths: {
		jquery: "lib/jquery-1.11.0.min",
		html:"lib/html",
		jspath:"lib/jspath",
		knockout:"lib/knockout-3.1.0",
		dataSource: "test/dataSource",
		common:"forms/common"
    },
	urlArgs: "bust=" + (new Date()).getTime(),
	shim:{
		"html":{exports:"Html"},
		"jspath":{exports:"JsPath"}
	}
});

requirejs(["jquery", "html", "forms/mainMenu", "util", "db"], function($, $H, mainMenu, util, db) {
		mainMenu.view($(".mainMenu"));
		
		var mainPnl = $(".mainPanel");
		util.wait(mainPnl);
		db.loadData(function(){
			mainPnl.html("");
		});
	}
);