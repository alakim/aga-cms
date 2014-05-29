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
		
		var keyField = {
			build: function(){
				$("div.pnlKey").parent().prepend($H.input({type:"button", value:"&gt;", "class":"btOpenKey"}));
				$("div.pnlKey").hide();
				$(".btOpenKey").css({float:"left"}).click(function(){
					if($(this).attr("value")=="<")
						keyField.close();
					else
						keyField.open();
				});
			},
			open: function(){
				$("div.pnlKey").show();
				$(".btOpenKey").attr("value", "<");
			},
			close: function(){
				$("div.pnlKey").hide();
				$(".btOpenKey").attr("value", ">");
			}
		}
		$(function(){
			$(".mainPanel").html("");
			keyField.build();
		});
		
		$(".btInit").click(function(){
			common.wait(mainPnl);
			keyField.close();
			db.loadData(function(){
				mainPnl.html("");
			});
		});
	}
);