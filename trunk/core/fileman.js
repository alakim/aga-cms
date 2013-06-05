(function($, H){
	var listView = {
		build: function(pnl, initPath, onFileSelect, getPassword){pnl=$(pnl);
		
			var initPath;
		
			function template(data, path, basePath){with(H){
				var bp = basePath?basePath.replace(/[^\/]+\/?$/i, ""):null;
				return ul({"class":"listView"},
					basePath&&path!=initPath?li({"class":"dir", path:basePath, basePath:bp}, ".."):null,
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
				if(!basePath) initPath = path;
				pnl.html(H.img({src:"core/wait.gif"}));
				var psw = getPassword();
				
				$.post("ls.php", {path:path, s:psw}, function(res){
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

	
	$.fn.fileManager = function(initPath, onFileSelect, getPassword){
		$(this).each(function(i, el){
			listView.build(el, initPath, onFileSelect, getPassword);
		});
	};
})(jQuery, Html);