<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=windows-1251">
	<title>Aga</title>
	<style type="text/css">
		.fileLink{
			cursor:pointer;
			color:#008;
		}
	</style>
	<script type="text/javascript" src="core/lib/html.js"></script>
	<script type="text/javascript" src="core/lib/jquery-1.9.1.min.js"></script>
	<script type="text/javascript" src="core/lib/jspath.js"></script>
	<script type="text/javascript" src="core/cdk.js"></script>
	<script type="text/javascript" src="core/editor.js"></script>
	<script type="text/javascript" src="core/defaultView.js"></script>
	<link rel="stylesheet" type="text/css" href="core/defaultView.css"/>
	
	<script type="text/javascript">
		function doBackup(){
			function template (res){with(Html){
				return res.error?span({"class":"error"}, res.error)
					:span(
						"Download backup file ",
						a({href:res.archive}, res.archive)
					);
			}}
			Editor.backup("testData", function(res){
				res = $.parseJSON(res);
				//$("#backupMessage").html(res.responseText);
				res = $.parseJSON(res.responseText);
				$("#backupMessage").html(template(res));
			});
		}
		
		function displayDoc(path){
			//console.log("display "+path+"...");
			
			Editor.display($("#out"), "testData/"+path, path.match(/\.jpg$/i));
		}
		
		$(function(){
			$(".fileLink")
				.click(function(){
					displayDoc($(this).text());
				});
		});
	</script>
</head>
<body>
	<h1>Aga</h1>
	<input type="button" value="Backup" onclick="doBackup()"/>
	<div id="backupMessage"></div>
	
	<h2>Files</h2>
	<table border="1" width="100%" cellpadding="3" cellspacing="0">
		<tr>
			<td valign="top" width="180">
				<?php
					$files = scandir("testData");
					foreach($files as $file){
						if($file!="." && $file!=".." && $file!=".svn")
							echo("<div class='fileLink'>{$file}</div>");
					}
				?>
			</td>
			<td valign="top">
				<div id="out"></div>
			</td>
		</tr>
	</table>
	
	
</body>
</html>


