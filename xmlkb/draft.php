<?php

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

	// echo(xml2html("../data/xmlkb/testToc.xml", "defs/toc.xslt"));
	echo(xml2html("../data/xmlkb/draft.xml", "defs/toc.xslt"));

?>
