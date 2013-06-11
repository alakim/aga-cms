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
				<script type="text/javascript" src="../core/lib/jquery-1.9.1.min.js"></script>
				<script type="text/javascript">
					$(function(){
						var dir = document.location.search.match(/\?p=(.+)\/[^\.]+\.xml$/)[1];
						$("img").each(function(i, img){img=$(img);
							var src = img.attr("src");
							$(img).attr({src:  "../data/xmlkb"+dir+"/"+src});
						});
						$(".tocmenu").click(function(){
							document.location="#toc";
						});
						$("h1").css({cursor:"pointer"}).attr({title:"К оглавлению"}).click(function(){
							document.location = "toc.php";
						});
					});
				</script>
			</head>
			<body>
				<h1><xsl:value-of select="section[1]/@title"/></h1>
				<div style="text-align:right; margin-right:40px;">
					<a href="toc.php">Оглавление</a>
				</div>
				<xsl:call-template name="toc"/>
				<!--xsl:apply-templates select="section" /-->
				<xsl:apply-templates select="*[local-name()!='book' and local-name()!='website' and local-name()!='webArticle']"/>
				<xsl:if test="book|webArticle">
					<h2>
						<a name="books">Литература</a>
					</h2>
					<!--p class="tocmenu" onclick="window.navigate('#toc')" style="cursor:hand;" title="К оглавлению">&#160;</p-->
					<p class="tocmenu" onclick="window.location='#toc'" title="К оглавлению">&#160;</p>
					<xsl:apply-templates select="book|webArticle"/>
				</xsl:if>
				<xsl:if test="website">
					<h2>
						<a name="websites">Веб-ресурсы</a>
					</h2>
					<!--p class="tocmenu" onclick="window.navigate('#toc')" style="cursor:hand;" title="К оглавлению">&#160;</p-->
					<p class="tocmenu" onclick="window.location='#toc'" title="К оглавлению">&#160;</p>
					<xsl:apply-templates select="website"/>
				</xsl:if>
			</body>
		</html>
	</xsl:template>
	
	<xsl:template name="toc">
		<a name="toc"></a>
		<ul class="toc">
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
		<xsl:variable name="indent">
			<xsl:value-of select="(count(ancestor::section)-1)*$indent_per_section"/>
		</xsl:variable>
		<a name="{generate-id()}"></a>
		<xsl:if test="count(ancestor::section)>0">
			<xsl:variable name="level">h<xsl:value-of select="count(ancestor::section)+1"/></xsl:variable>
			<xsl:element name="{$level}">
				<xsl:attribute name="style">margin-left:<xsl:value-of select="$indent"/>;</xsl:attribute>
				<xsl:value-of select="@title"/>
			</xsl:element>
			<xsl:if test="not(ancestor::section[@viewmode='table'])">
				<xsl:call-template name="tocmenu"/>
			</xsl:if>

		</xsl:if>
		<xsl:apply-templates />

		<!-- xsl:apply-templates select="section"/-->
	</xsl:template>

	<xsl:template name="tocmenu">
		<!--p class="tocmenu" onclick="window.navigate('#toc')" style="cursor:hand;" title="К оглавлению">&#160;-->
		<p class="tocmenu" onclick="window.location='#toc'" title="К оглавлению">
			<a>
				<xsl:attribute name="href">#<xsl:value-of select="substring-after(generate-id(parent::section), $standard-Id-label)"/></xsl:attribute>
				<xsl:attribute name="title"><xsl:value-of select="parent::section/@title"/></xsl:attribute>
				<xsl:text disable-output-escaping="yes">&amp;#x25B2;</xsl:text> <xsl:value-of select="parent::section/@title"/>
			</a>
			<xsl:text disable-output-escaping="yes">&amp;#160;&amp;#160;&amp;#160;&amp;#160;</xsl:text><xsl:apply-templates select="section" mode="tocmenu"/>
		</p>
	</xsl:template>
	
	<xsl:template match="section" mode="tocmenu">
		<nobr>
			<a>
				<xsl:attribute name="href">#<xsl:value-of select="substring-after(generate-id(), $standard-Id-label)"/></xsl:attribute>
				<xsl:attribute name="title"><xsl:value-of select="@title"/></xsl:attribute>
				<!--&#8226;-->
				<!-- в подменю раздела -->
				<xsl:text disable-output-escaping="yes">&amp;#x25bc;</xsl:text> <xsl:value-of select="@title"/>
			</a><xsl:text disable-output-escaping="yes">&amp;#160;</xsl:text>
	</nobr>
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
	
	<xsl:template match="cit">
		<p class="cit">
			<xsl:apply-templates/>
		</p>
	</xsl:template>
	<xsl:template match="note">
		<xsl:choose>
			<xsl:when test="parent::section">
				<p class="note">
					<xsl:apply-templates/>
				</p>
			</xsl:when>
			<xsl:otherwise>
				<span class="note">
					<xsl:apply-templates/>
				</span>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="srctext">
		<p class="srctext">
			<xsl:apply-templates/>
		</p>
	</xsl:template>
	<xsl:template match="class">
		<span class="class">
			<xsl:value-of select="."/>
		</span>
	</xsl:template>
	<xsl:template match="sel">
		<xsl:choose>
			<!--xsl:when test="parent::cmd"><span style="color:#88ff88;"><xsl:apply-templates/></span></xsl:when-->
			<xsl:when test="parent::cmd">
				<span style="padding:2px; background-color:#707070;">
					<xsl:apply-templates/>
				</span>
			</xsl:when>
			<xsl:when test="parent::code">
				<span style="background-color:#cccccc; font-weight:normal;">
					<xsl:apply-templates/>
				</span>
			</xsl:when>
			<!--xsl:when test="parent::code"><span style="font-weight:bold;"><xsl:apply-templates/></span></xsl:when-->
			<xsl:otherwise>
				<b>
					<xsl:apply-templates/>
				</b>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="notice">
		<xsl:choose>
			<xsl:when test="parent::li">
				<span class="opennotice" onclick="{substring-after(generate-id(), $standard-Id-label)}.style.display=({substring-after(generate-id(), $standard-Id-label)}.style.display=='block')?'none':'block'">...</span>
				<div class="hiddennotice" onclick="this.style.display='none'" id="{substring-after(generate-id(), $standard-Id-label)}">
					<xsl:apply-templates/>
				</div>
			</xsl:when>
			<xsl:otherwise>
				<div class="notice">
					<xsl:apply-templates/>
				</div>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="attention">
		<div class="attention">
			<xsl:apply-templates/>
		</div>
	</xsl:template>
	<xsl:template match="conclusion">
		<div class="conclusion">
			<xsl:apply-templates/>
		</div>
	</xsl:template>
	
	<xsl:template match="book | webArticle">
		<p>
			<a>
				<xsl:attribute name="name"><xsl:value-of select="substring-after(generate-id(.), $standard-Id-label)"/></xsl:attribute>
				<xsl:value-of select="count(preceding::book | preceding::webArticle)+1"/>.
				<xsl:if test="@author">
					<span style="font-style:italic">
						<xsl:value-of select="@author"/>
					</span>. </xsl:if>
				<xsl:if test="@title">
					<xsl:choose>
						<xsl:when test="@url">
							<a href="{@url}">
								<xsl:value-of select="@title"/>
							</a>
						</xsl:when>
						<xsl:otherwise>
							<b>
								<xsl:value-of select="@title"/>
							</b>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:if>
				<xsl:if test="@altUrl"> (<a href="{@altUrl}">зеркало</a>)</xsl:if>
				<xsl:if test="@translationUrl"> (<a href="{@translationUrl}">перевод</a>)</xsl:if>
				<xsl:if test="@pub"> - <xsl:value-of select="@pub"/>
				</xsl:if>
				<xsl:if test="*|text()"> (<xsl:apply-templates/>)</xsl:if>
			</a>
		</p>
	</xsl:template>
	<xsl:template match="website">
		<p>
			<a href="{@url}">
				<xsl:value-of select="@title"/>
			</a>
			<xsl:if test="node()">
				- <xsl:apply-templates/>
			</xsl:if>
		</p>
	</xsl:template>

	
	
	<xsl:template match="ref">
		<xsl:choose>
			<xsl:when test="@url">
				<a href="{@url}">
					<xsl:value-of select="."/>
				</a>
			</xsl:when>
			<xsl:when test="@xart">
				<xsl:variable name="tocPath">
					<xsl:value-of select="/article/@rootDir"/>../<xsl:value-of select="/article/@targetSite"/>
				</xsl:variable>
				<xsl:variable name="targetPage">
					<xsl:value-of select="bs:urlNoSection(@xart)"/>
				</xsl:variable>
				<xsl:choose>
					<xsl:when test="not(/article/@targetSite) or document($tocPath)//page[@src=$targetPage]">
						<xsl:variable name="doc">
							<xsl:value-of select="//article/@rootDir"/>
							<xsl:value-of select="@xart"/>
						</xsl:variable>
						<xsl:variable name="sId" select="bs:sectionId(@xart)"/>
						<xsl:variable name="fileRef">
							<xsl:value-of select="//article/@rootDir"/>
							<xsl:value-of select="bs:fileName(@xart)"/>.xml<xsl:if test="not($sId='')">#<xsl:value-of select="$sId"/>
							</xsl:if>
						</xsl:variable>
						<xsl:variable name="tit">
							<xsl:value-of select="document($doc)//article/section/@title"/>
							<xsl:if test="not($sId='')"> / <xsl:value-of select="document($doc)//section[@id=$sId]/@title"/>
							</xsl:if>
						</xsl:variable>
						<a href="{$fileRef}">
							<xsl:choose>
								<xsl:when test="text()">
									<xsl:attribute name="title"><xsl:value-of select="$tit"/></xsl:attribute>
									<xsl:value-of select="."/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="$tit"/>
								</xsl:otherwise>
							</xsl:choose>
						</a>
					</xsl:when>
					<xsl:otherwise/>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="@xSoftClass">
				<xsl:variable name="doc">
					<xsl:value-of select="@xSoftClass"/>
				</xsl:variable>
				<xsl:variable name="fileRef">
					<xsl:value-of select="substring-before($doc, '.')"/>.html
				</xsl:variable>
				<a href="{$fileRef}">
					<xsl:choose>
						<xsl:when test="text()">
							<xsl:value-of select="."/>
						</xsl:when>
						<xsl:otherwise>Класс <xsl:value-of select="document($doc)//class/@name"/>
						</xsl:otherwise>
					</xsl:choose>
				</a>
			</xsl:when>
			<xsl:when test="@sect">
				<xsl:variable name="id">
					<xsl:value-of select="@sect"/>
				</xsl:variable>
				<a>
					<xsl:attribute name="href">#<xsl:value-of select="substring-after(generate-id(//section[@id = $id]), $standard-Id-label)"/></xsl:attribute>
					<xsl:attribute name="title">см. "<xsl:value-of select="//section[@id = $id]/@title"/>"</xsl:attribute>
					<xsl:choose>
						<xsl:when test="text()">
							<xsl:value-of select="."/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="//section[@id = $id]/@title"/>
						</xsl:otherwise>
					</xsl:choose>
				</a>
			</xsl:when>
			<xsl:when test="@book">
				<xsl:variable name="bkID" select="@book"/>
				<xsl:variable name="book" select="//*[@id=$bkID]"/>
				[<a>
					<xsl:attribute name="href">#<xsl:value-of select="substring-after(generate-id($book), $standard-Id-label)"/></xsl:attribute>
					<xsl:variable name="num" select="count($book/preceding::book|$book/preceding::webArticle)+1"/>
					<xsl:attribute name="title"><xsl:value-of select="$num"/>. <xsl:choose><xsl:when test="$book/@title"><xsl:value-of select="$book/@title"/></xsl:when><xsl:otherwise><xsl:value-of select="$book"/></xsl:otherwise></xsl:choose></xsl:attribute>
					<xsl:value-of select="$num"/>
				</a>]
		</xsl:when>
			<xsl:when test="@website">
				<xsl:variable name="wID" select="@website"/>
				<xsl:variable name="wSite" select="//*[@id=$wID]"/>
				<a>
					<xsl:attribute name="href"><xsl:value-of select="$wSite/@url"/></xsl:attribute>
					<xsl:choose>
						<xsl:when test="text()">
							<xsl:attribute name="title"><xsl:value-of select="$wSite/@title"/><xsl:if test="$wSite/text()">&#10;(<xsl:value-of select="$wSite/text()"/>)</xsl:if></xsl:attribute>
							<xsl:value-of select="."/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:attribute name="title"><xsl:value-of select="$wSite"/></xsl:attribute>
							<xsl:value-of select="$wSite/@title"/>
						</xsl:otherwise>
					</xsl:choose>
				</a>
			</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template match="optional">
		<p>
			<xsl:apply-templates select="caption" mode="optional"/>&#160;&#160;
		<span id="{substring-after(generate-id(), $standard-Id-label)}ctrl" class="optbutton" onclick="{substring-after(generate-id(), $standard-Id-label)}.style.display=({substring-after(generate-id(), $standard-Id-label)}.style.display=='block')?'none':'block'; {substring-after(generate-id(), $standard-Id-label)}ctrl.innerText=({substring-after(generate-id(), $standard-Id-label)}.style.display=='block')?'&#160;скрыть&#160;&#160;':'показать'">показать</span>
		</p>
		<div id="{substring-after(generate-id(), $standard-Id-label)}">
			<xsl:attribute name="style">
			display:none;
			border-style:solid;
			border-color:gray;
			border-left-width:1px;
			border-top-width:1px;
			border-right-width:10px;
			border-bottom-width:10px;
			padding:4px;
			margin-left:20px;
			margin-right:20px;
		</xsl:attribute>
			<xsl:apply-templates/>
		</div>
	</xsl:template>
	<xsl:template match="caption" mode="optional">
		<xsl:apply-templates/>
	</xsl:template>

	<xsl:template match="img">
		<img src="{@src}"/>
	</xsl:template>

	<xsl:template match="classify" mode="classification">
		<span class="classifier">
			<!-- *****xsl:value-of select="$classifierUrl"/-->
			<xsl:variable name="classifier" select="document($classifierUrl)"/>
			<xsl:variable name="facet" select="@facet"/>
			<xsl:variable name="rubric" select="@rubric"/>
			<xsl:choose>
				<xsl:when test="not($classifier//rubric[@id=$rubric])">
					<span style="background-color:red; color:yellow; font-weight:bold;">Не существует рубрика <xsl:value-of select="$rubric"/>!</span>
				</xsl:when>
				<xsl:otherwise>
					<xsl:variable name="rub" select="$classifier//rubric[@id=$rubric]"/>
					<xsl:attribute name="title"><xsl:value-of select="$rub/parent::facet/@name"/></xsl:attribute>
					<xsl:value-of select="$rub/@name"/>
				</xsl:otherwise>
			</xsl:choose>
		</span>
	</xsl:template>
	<xsl:template match="classify"/>

	
	<xsl:template match="*"><span style="color:red; background-color:yellow; font-weight:bold;">Unknown tag &lt;<xsl:value-of select="name(.)"/>&gt;</span ></xsl:template>

</xsl:stylesheet>
