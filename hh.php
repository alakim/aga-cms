<?php 
	$psw = $_REQUEST["p"];
	
	echo(crypt($psw));
?>
