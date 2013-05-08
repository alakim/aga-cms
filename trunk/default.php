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
	<script type="text/javascript" src="core/textView.js"></script>
	<script type="text/javascript" src="core/defaultView.js"></script>
	<script type="text/javascript" src="core/fileman.js"></script>
	<link rel="stylesheet" type="text/css" href="core/defaultView.css"/>
	
	<?php
		$dataDir = "testData";
	?>
	<script type="text/javascript">
		var dataDir = "<?php echo($dataDir);?>";

		function doBackup(){
			function template (res){with(Html){
				return res.error?span({"class":"error"}, res.error)
					:span(
						"Download backup file ",
						a({href:res.archive}, res.archive)
					);
			}}
			Editor.backup(dataDir, function(res){
				res = $.parseJSON(res);
				//$("#backupMessage").html(res.responseText);
				res = $.parseJSON(res.responseText);
				$("#backupMessage").html(template(res));
			});
		}
		
		function displayDoc(path){
			//console.log("display "+path+"...");
			var secure = $("#cbSecure")[0].checked;
			//Editor.display($("#out"), dataDir+"/"+path, path.match(/\.jpg$/i));
			Editor.display($("#out"), dataDir+"/"+path, secure);
		}
		
		$(function(){
			$(".fileLink")
				.click(function(){
					displayDoc($(this).text());
				});
			$("#fldPassword").change(function(){
				Editor.password = $(this).val();
			});
			
			$("#fileManager").fileManager("/home/u372483460/public_html/aga-trunk/");
		});
	</script>
</head>
<body>
	<h1>Aga</h1>
	<input type="button" value="Backup" onclick="doBackup()"/>
	<div id="backupMessage"></div>
	<div>Password: <input type="password" id="fldPassword"/> <input type="checkbox" id="cbSecure"/></div>
	<h2>Files</h2>
	<table border="1" width="100%" cellpadding="3" cellspacing="0">
		<tr>
			<td valign="top" width="180">
				<?php
					$files = scandir($dataDir);
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
	
	<div id="fileManager"></div>
	
	
</body>
</html>


