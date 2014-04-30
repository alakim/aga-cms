requirejs.config({
    baseUrl: "js",
    paths: {
		jquery: "lib/jquery-1.11.0.min",
		html:"lib/html",
		knockout:"lib/knockout-3.1.0",
		dataSource: "test/dataSource",
		common:"forms/common"
    },
	urlArgs: "bust=" + (new Date()).getTime(),
	shim:{
		"html":{exports:"Html"}
	}
});

requirejs(["jquery", "html", "forms/mainMenu"], function($, $H, mainMenu) {
		mainMenu.view($(".mainMenu"));
		

		
	}
);