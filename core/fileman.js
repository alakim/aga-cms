(function($, H){
	var listView = {
		build: function(pnl, initPath, onFileSelect){pnl=$(pnl);
		
			function template(data, path, basePath){with(H){
				return ul({"class":"listView"},
					basePath?li({"class":"dir", path:basePath}, ".."):null,
					apply(data.items, function(itm){
						if(!itm) return;
						if(!itm.dir) return;
						return li({"class":"dir", path:path+itm.name+"/", basePath:path}, itm.name, "/");
					}),
					apply(data.items, function(itm){
						if(!itm) return;
						if(itm.dir) return;
						return li({"class":"file", path:path+itm.name}, itm.name);
					})
				);
			}}
			
			function navigate(path, basePath){
				pnl.html(H.img({src:"core/wait.gif"}));
				
				$.post("ls.php", {path:path}, function(res){
					var jsData = $.parseJSON(res);
					var view = $(template(jsData, path, basePath));
					view.find("li").css({cursor:"pointer"}).click(function(){var _=$(this);
						var path2 = _.attr("path");
						var basePath2 = _.attr("basePath");
						if(_.hasClass("dir"))
							navigate(path2, basePath2);
						else if(_.hasClass("file"))
							onFileSelect(path2);
					});
					pnl.html(view);
				});
			}
			
			navigate(initPath);
		}
	};

	
	$.fn.fileManager = function(initPath, onFileSelect){
		$(this).each(function(i, el){
			listView.build(el, initPath, onFileSelect);
		});
	};
})(jQuery, Html);