<?php 
	$path = $_REQUEST["path"];
	echo("{\"items\":[");
	$files = scandir($path);
	foreach($files as $file){
		if($file!="." && $file!=".." && $file!=".svn"){
			echo("{\"name\":\"{$file}\"");
			if(is_dir($path."/".$file))
				echo(",\"dir\":true");
			echo("},");
		}
	}
	echo("null]}");

?>
