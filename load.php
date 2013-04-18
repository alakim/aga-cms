<?php 
	$docNm = $_REQUEST["path"];
	$content = file_get_contents($docNm);
	echo($content);
?>
