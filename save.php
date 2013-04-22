<?php 
	$docPath = $_REQUEST["path"];
	$docContent = $_REQUEST["data"];
	file_put_contents($docPath, $docContent);
	echo ($docContent);
?>
