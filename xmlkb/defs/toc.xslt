<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:bs="http://www.bicyclesoft.com/xPublish"
	>
	<xsl:output method="html" version="1.0" encoding="Windows-1251" indent="yes"/>
	

	
	<xsl:template match="toc">
		<html>
		<head>
			<title><xsl:value-of select="//toc/@name"/></title>
			<style>
			body{
				font-family: Helvetica, Verdana, Sans-serif;
				font-size:14px;
			}
			h1,h2,h3,h4{
				margin-top:5px;
				margin-bottom:0px;
				padding-bottom:0px;
			}
			h1{font-size:18px;}
			h2{font-size:16px;}
			h3{font-size:14px;}
			h4{font-size:14px; font-style:italic;}
			p{
				margin:0px;
				padding:0px;
			}
			div.section{
				margin-left:20px;
				padding-left:10px;
				border-left: 1 solid #888888;
			}
			a{
				color:#000088;
				text-decoration:none;
			}
			a:hover{
				color:#0000ff;
				text-decoration:underline;
			}
			span.sectionButton{
				margin-left:10px;
				font-size:16px;
				font-family:arial, sans-serif;
				cursor:hand;
				cursor:pointer;
				color:#222288;
			}
			div.section2{
				margin-left:30px;
				font-size:12px;
				color:#888888;
			}
			div.subToc{
				margin-left:20px;
			}
			</style>
		</head>
		<body>
			<h1><xsl:value-of select="//toc/@name"/></h1>
			<xsl:apply-templates />
		</body>
		</html>
	</xsl:template>
	
	<xsl:template match="section">
		<xsl:variable name="level" select="count(ancestor-or-self::section)"/>
		<xsl:element name="h{$level}"><xsl:value-of select="@title"/></xsl:element>
		<div class="section" style="display:block;" id="{generate-id()}">
			<xsl:apply-templates/>
		</div>
	</xsl:template>
	
	<xsl:template match="page">
		<xsl:variable name="src">/home/u372483460/public_html/aga/data/xmlkb/<xsl:value-of select="@src"/></xsl:variable>
		<p>
			<a href="page.php?p={@src}">
				<xsl:value-of select="document($src)//article/section/@title"/>
			</a>
		</p>
		

	</xsl:template>

</xsl:stylesheet>
