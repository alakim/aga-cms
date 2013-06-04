<html>
<head>
	<title>KB Index</title>
	<meta http-equiv="Content-Type" content="text/html; charset="utf-8"/>
	<link rel="stylesheet" type="text/css" href="styles.css"/>
</head>
<body>
	<h1>XML KB Index</h1>
	
	<?php
		
		function ls($basePath, $path){
			echo("<ul>");
			$files = scandir($basePath.$path);
			
			foreach($files as $file){
				if($file!="." && $file!=".." && $file!=".svn"){
					echo("<li>");
					if(is_dir($basePath.$path."/".$file)){
						echo($file);
						ls($basePath, $path."/".$file);
					}
					else{
						echo("<a href=\"page.php?p={$path}/{$file}\">{$file}</a>");
					}
					echo("</li>");
				}
			}
			echo("</ul>");
		}

		ls("../data/xmlkb/", "");
	?>
</body>
</html>