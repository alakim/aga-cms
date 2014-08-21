<?php 
	$docNm = "../data/".$_REQUEST["path"];
	if(!file_exists($docNm)){die();}
	$content = file_get_contents($docNm);
	$fsz = filesize($docNm);
	echo("{\"size\":".$fsz.",\"data\":\"".$content."\"}");
?>
