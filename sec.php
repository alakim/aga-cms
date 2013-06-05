<?php 

	function checkAccess($psw){
		$std = '$1$oy789FnX$n456FkIc4Hrm123PZ0IEO/';
		return crypt($psw, $std) == $std;
	}
	
	// if(checkAccess($_REQUEST["p"])) 
	// 	echo("OK");
	// else
	// 	echo("FAIL");
?>
