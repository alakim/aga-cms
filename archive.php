<?php 
	$dirPath = $_REQUEST["d"];
	
	$date = new DateTime();
	$archName = "backup/backup_".$date->format("YmdHis").".zip";
	
	
	
	class Zipper extends ZipArchive {
		public function addDir($path) {
			$this->addEmptyDir($path);
			$nodes = glob($path . '/*');
			foreach ($nodes as $node) {
				if (is_dir($node)) {
					$this->addDir($node);
				} else if (is_file($node))  {
					$this->addFile($node);
				}
			}
		}
	}
	

	
	$zip = new Zipper;
	if ($zip->open($archName, ZipArchive::CREATE) ){ //=== TRUE) {
		$zip->addDir($dirPath);
		$zip->close();
		echo("{\"archive\":\"{$archName}\"}");
	} else {
		echo("{\"error\":\"Backup error. Can't open file '{$archName}'\"}");
	}
	
?>
