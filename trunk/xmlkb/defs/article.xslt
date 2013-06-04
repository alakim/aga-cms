<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:bs="http://www.bicyclesoft.com/xPublish">
	<xsl:output method="html" version="1.0" encoding="utf-8" indent="yes"/>
	
	<xsl:variable name="indent_per_section">40</xsl:variable>
	<xsl:variable name="standard-Id-label"/>

	<xsl:template match="/article">
		<html>
			<head>
				<meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
				<link rel="stylesheet" type="text/css" href="styles.css"/>
			</head>
			<body>
				<xsl:call-template name="toc"/>
				<xsl:apply-templates select="section" />
			</body>
		</html>
	</xsl:template>
	
	<xsl:template name="toc">
		<ul>
			<xsl:apply-templates select="section" mode="toc"/>
		</ul>
	</xsl:template>

	<xsl:template match="section" mode="toc">
		<li><a href="#{generate-id()}"><xsl:value-of select="@title"/></a>
			<xsl:if test="section">
				<ul><xsl:apply-templates select="section" mode="toc"/></ul>
			</xsl:if>
		</li>
	</xsl:template>
	
	<xsl:template match="section">
		<a name="{generate-id()}"></a>
		<xsl:variable name="level">h<xsl:value-of select="count(ancestor::section)+1"/></xsl:variable>
		<xsl:element name="{$level}"><xsl:value-of select="@title"/></xsl:element>
		<xsl:apply-templates />

		<!-- xsl:apply-templates select="section"/-->
	</xsl:template>
	
	<xsl:template match="p"><p><xsl:apply-templates/></p></xsl:template>
	
	<xsl:template match="code">
		<xsl:choose>
			<xsl:when test="@display='inline'">
				<span class="code">
					<xsl:apply-templates/>
				</span>
			</xsl:when>
			<xsl:when test="@display='block' or parent::section or parent::optional or parent::new">
				<xsl:if test="caption">
					<p>
						<xsl:value-of select="caption"/>:</p>
				</xsl:if>
				<pre class="code">
					<xsl:apply-templates/>
				</pre>
			</xsl:when>
			<xsl:otherwise>
				<span class="code">
					<xsl:apply-templates/>
				</span>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template match="file">
		<span class="file">
			<xsl:value-of select="."/>
		</span>
	</xsl:template>
	<xsl:template match="url">
		<span class="file">
			<xsl:apply-templates/>
		</span>
	</xsl:template>
	<xsl:template match="regPath">
		<span class="file">
			<xsl:value-of select="."/>
		</span>
	</xsl:template>

	<xsl:template match="list">
		<xsl:apply-templates select="caption" mode="list"/>
		<xsl:variable name="listtype">
			<xsl:choose>
				<xsl:when test="@marker='num'">ol</xsl:when>
				<xsl:otherwise>ul</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:element name="{$listtype}">
			<xsl:if test="@marker = 'none'">
				<xsl:attribute name="style">list-style-type:none;</xsl:attribute>
			</xsl:if>
			<xsl:apply-templates/>
		</xsl:element>
	</xsl:template>
	<xsl:template match="li">
		<li>
			<xsl:if test="@name">
				<b>
					<xsl:value-of select="@name"/>
				</b> - </xsl:if>
			<xsl:apply-templates/>
		</li>
	</xsl:template>
	<xsl:template match="caption" mode="list">
		<p>
			<xsl:apply-templates/>:</p>
	</xsl:template>
	<xsl:template match="caption"/>
	<xsl:template match="picture">
		<center>
			<img src="{@src}"/>
			<p class="picdsc">
				<xsl:value-of select="."/>
			</p>
		</center>
	</xsl:template>
</xsl:stylesheet>
