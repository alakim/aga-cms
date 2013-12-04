(function($){	$.fn.solarSystem = function(options){		var redrawAll = (this.data("settings")&&this.data("settings").viewType!=options.viewType)			|| !this.data("planets")			|| options.displayPlanets;				var state = this.data("settings");		if(state) options = $.extend(state, options);				var defaults = {			margin: 10,			viewType: "reg",			NorthwardEquinox: new Date(2012, 2, 20)		};		var opt = $.extend(true, defaults, options);				if(!opt.today) opt.today = new Date();				var center = {x:opt.w/2, y:opt.h/2};				var aries = "m8.86764,5.62034c-0.19426,0.00406 -0.40583,0.07723 -0.64517,0.21646c-1.44078,0.83813 -1.91368,2.23724 -1.94077,2.2949c-0.22601,-0.91004 -0.74074,-2.33595 -1.63815,-2.03114c-1.27293,0.4323 -1.6329,1.44166 -1.6329,1.44166l-0.07251,0.3835c0,0 0.02534,-0.14459 0.745,-0.79225c0.48035,-0.43234 0.71993,-1.20076 1.41644,-0.14398c0.68996,1.04683 0.28896,5.66789 0.28896,5.66789c-0.01182,-0.0069 0.16746,0.77211 0.91207,0.21646c0.50273,-0.37517 0.17816,-4.00246 0.11979,-4.03499c-0.02079,-0.01177 0.02765,-0.1169 -0.01397,-0.32077c0.13756,-0.31329 0.45949,-1.0595 0.97481,-1.67298c0.50437,-0.60044 1.03306,-0.95998 1.46538,-0.95998c0.43232,0 0.52854,0.26421 0.52854,0.50437c0,0.24021 -0.24063,0.81617 0.09562,0.59999c0.43612,-0.28037 0.29413,-0.51266 0.21646,-0.79225c-0.08256,-0.29726 -0.39222,-0.58335 -0.8196,-0.57689l0.00001,0z";				/* 	idx - ���������� ����� �������			d - ������� ������� ��� �����������(px)			siderT - ������������ ��� (� ������ ������)			ra - ������ ������ � ������ (�.�.)			opposition - ���� ���������� �������������� (�������� ���������� ��� ������ ������)		*/		var objects = {			Sun:{idx:0, color:"#ffc", d:10},			Mercury:{idx:1, color:"#fff", d:3, siderT:87.97, ra:0.47, opposition:new Date(2012,10,16)},			Venus:{idx:2, color:"#eef", d:5, siderT:224.70, ra:0.73, opposition:new Date(2012,5,4)},			Earth:{idx:3, color:"#ccf", d:5, siderT:365.26, ra:1.02},			Mars:{idx:4, color:"#fcc", d:4, siderT:686.98, ra:1.67, opposition:new Date(2012,2,3)},			Jupiter:{idx:5, color:"#fee", d:8, siderT:4332.59, ra:5.46, opposition:new Date(2012,11,3)},			Saturn:{idx:6, color:"#ccc", d:7, siderT:10759.22, ra:10.12, opposition:new Date(2012,3,15)},			Uranus:{idx:7, color:"#ccc", d:6, siderT:30799.1, ra:20.08, opposition:new Date(2012,8,29)},			Neptune:{idx:8, color:"#ccf", d:6, siderT:60190, ra:30.44, opposition:new Date(2012,7,24)}			//Pluto:{idx:9, color:"#ccc", d:3, siderT:90613.31, ra:39.48}		};		$.extend(true, objects, opt.objects);				var orbitCount = -1;		for(var k in objects) if(displayPlanet(k))orbitCount++;		var maxRadius = 0;		for(var k in objects)if(displayPlanet(k) && (maxRadius<objects[k].ra)) maxRadius = objects[k].ra;				function daysInterval(date1, date2){			return (date2-date1)/(1000*60*60*24);		}				function dayOfYear(date){			var newYr = new Date(1900+date.getYear(), 0, 1)			return daysInterval(newYr, date);		}				function earthEclipticLongitude(date){			date = date || opt.today;			return dayOfYear(date)*-360/objects.Earth.siderT;		}						function eclipticLongitude(planetName){ //������������� ����������������� �������			if(planetName=="Sun") return 0;			var planet = objects[planetName];			if(planetName=="Earth") return earthEclipticLongitude();			var oppDays = daysInterval(planet.opposition, opt.today);			var dPh = oppDays*-360/planet.siderT;			return dPh + earthEclipticLongitude(planet.opposition);		}				function orbitRadius(nm){			var idx = objects[nm].idx;			if(idx==0) return 0;			var size = Math.min(opt.h, opt.w)/2 - opt.margin;			switch(opt.viewType){				case "prop": return size*objects[nm].ra/maxRadius;				case "log": return size*(1+Math.log(objects[nm].ra))/(1+Math.log(maxRadius));				case "reg":				default:					var orbitStep = (size)/orbitCount;					return orbitStep*idx;			}		}				function displayPlanet(nm){			if(nm=="Sun") return true;			return !opt.displayPlanets || opt.displayPlanets[nm];		}				function Planet(P, nm){			if(!displayPlanet(nm)) return;			var orbitR = orbitRadius(nm);			P.circle(center.x, center.y, orbitR).attr({"stroke-width":1, stroke:opt.color.fore, opacity:.7});			return P.circle(center.x, center.y - orbitR, objects[nm].d)				.attr({fill:objects[nm].color, "stroke-width":0, title:nm})				.transform(["R", eclipticLongitude(nm), center.x, center.y]);		}				function equinox(P){			var angle = earthEclipticLongitude(opt.NorthwardEquinox);			var line = P.path(["M",center.x,center.y,"L", center.x, 0])				.attr({"stroke-width":1, stroke:opt.color.fore})				.transform(["R", angle, center.x, center.y]);			P.path([					"M",center.x,center.y,"L", opt.w-opt.margin, center.y, 					"M",center.x,center.y,"L", opt.margin, center.y, 					"M",center.x,center.y,"L", center.x, opt.h				])				.attr({"stroke-width":1, stroke:opt.color.fore})				.transform(["R", angle, center.x, center.y]);										var bbx = line.getBBox();			P.path(aries)				.attr({fill:opt.color.fore, "stroke-width":0})				.transform(["T",bbx.x-15, bbx.y-10,"S",2.2]);		}				function buildScreen(pnl){			$(pnl).html("");			var P = new Raphael(pnl, opt.w, opt.h);			var body = P.rect(0, 0, opt.w, opt.h)				.attr({fill:opt.color.back});			equinox(P);							var planets = {};							for(var k in objects){				planets[k] = Planet(P, k);			}						var captured;			var capturedColor;			function releaseCaptured(){				if(!captured) return;				captured.attr({fill:capturedColor});				captured = null;			}			body.mouseup(releaseCaptured);			var bodyPos = {x:body.attr("x"), y:body.attr("y")};						function length(dx, dy){return Math.sqrt(dx*dx + dy*dy);}						if(planets.Earth){				planets.Earth					.attr({cursor:"pointer"})					.drag(						function(dx, dy, x, y){							var r = {w:captured.attr("cx") - center.x, h:captured.attr("cy") - center.y};							var rLng = length(r.w, r.h);							var lng = length(dx, dy);							var angle = Math.atan(lng/rLng)*360/(2*Math.PI);							if(r.w>0&&r.h>0&&dx>0								|| r.w>0&&r.h<0&&dx<0								|| r.w<0&&r.h<0&&dx<0								|| r.w<0&&r.h>0&&dx>0							) angle = -angle;							captured.transform(["R", -angle, center.x, center.y]);						},						function(){							captured = this;							capturedColor = captured.attr("fill");							captured.attr({fill:"#f00"});						},						releaseCaptured					);			}			$(pnl).data("planets", planets)				.data("settings", $.extend(true,{},opt));		}				function movePlanets(pnl){			var planets = $(pnl).data("planets");			$.each(planets, function(nm, planet){				planet.transform(["R", eclipticLongitude(nm), center.x, center.y]);			});		}				return this.each(function(i, itm){			if(redrawAll) buildScreen(itm);			else movePlanets(itm);		});	};})(jQuery);