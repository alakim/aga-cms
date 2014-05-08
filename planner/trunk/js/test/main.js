requirejs.config({
    baseUrl: "js",
    paths: {
		jquery: "lib/jquery-1.11.0.min",
		html:"lib/html",
		jspath:"lib/jspath",
		knockout:"lib/knockout-3.1.0",
		//dataSource: "test/dataSource",
		common:"forms/common"
    },
	urlArgs: "bust=" + (new Date()).getTime(),
	shim:{
		"html":{exports:"Html"},
		"jspath":{exports:"JsPath"}
	}
});

requirejs(["jquery", "html", "test/dsTests"], function($, $H, dsTests) {
		//$("#out").html("Tests are performed!");
		
		dsTests.run();
		
	}
);