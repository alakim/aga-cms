<?php 
	$docPath = $_POST["path"];
	$docContent = stripslashes($_POST["data"]);
	file_put_contents($docPath, $docContent);
	echo ($docContent);
?>
