(function($, H){
	var listView = {
		build: function(pnl, initPath, upPath){pnl=$(pnl);
			function template(data, path){with(H){
				return ul({"class":"listView"},
					upPath?li({"class":"dir", path:upPath}, ".."):null,
					apply(data.items, function(itm){
						if(!itm) return;
						if(!itm.dir) return;
						return li({"class":"dir", path:path+itm.name+"/"}, itm.name, "/");
					}),
					apply(data.items, function(itm){
						if(!itm) return;
						if(itm.dir) return;
						return li({"class":"file", path:path+itm.name}, itm.name);
					})
				);
			}}
			
			$.post("ls.php", {path:initPath}, function(res){
				var jsData = $.parseJSON(res);
				var view = $(template(jsData, initPath));
				view.find("li").css({cursor:"pointer"}).click(function(){var _=$(this);
					var path = _.attr("path");
					//console.log(path);
					if(_.hasClass("dir"))
						listView.build(pnl, path, initPath);
					else if(_.hasClass("file"))
						listView.onFileSelect(path);
				});
				pnl.html(view);
			});
		},
		onFileSelect: function(path){
			console.log(path);
		}
	};

	
	$.fn.fileManager = function(initPath){
		$(this).each(function(i, el){
			listView.build(el, initPath);
		});
	};
})(jQuery, Html);