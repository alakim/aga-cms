<?php
	$page = $_REQUEST["p"];

	function xml2html($xmldata, $xsl)
	{
		$xmlDoc = new DOMDocument();
		$xmlDoc->load($xmldata);

		$xslDoc = new DOMDocument();
		$xslDoc->load($xsl);

		$proc = new XSLTProcessor();
		$proc->importStylesheet($xslDoc);
		return $proc->transformToXML($xmlDoc);
	}

	if($page)
		echo(xml2html("../data/xmlkb/".$page.".xml", "defs/article.xslt"));

?>
