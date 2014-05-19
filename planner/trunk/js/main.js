requirejs.config({
    baseUrl: "js",
    paths: {
		jquery: "lib/jquery-1.11.0.min",
		html:"lib/html",
		jspath:"lib/jspath",
		jsflow:"lib/jsflow",
		cdk:"lib/cdk",
		knockout:"lib/knockout-3.1.0",
		//dataSource: "test/dataSource",
		common:"forms/common"
    },
	urlArgs: "bust=" + (new Date()).getTime(),
	shim:{
		"html":{exports:"Html"},
		"jspath":{exports:"JsPath"},
		"jsflow":{exports:"JSFlow"},
		"cdk":{exports:"Cdk"}
	}
});

requirejs(["jquery", "html", "forms/mainMenu", "forms/common", "db"], function($, $H, mainMenu, common, db) {
		mainMenu.view($(".mainMenu"));
		
		var mainPnl = $(".mainPanel");
		
		$(".btInit").click(function(){
			common.wait(mainPnl);
			db.loadData(function(){
				mainPnl.html("");
			});
		});
	}
);