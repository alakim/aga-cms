var SolarSystemCalc = (function($,$H){
	var solarSystem = {
		Sun:{diameter:1.392e9},
		Mercury:{diameter:2.44e6*2, orbit:(6.98e10+4.6e10)/2},
		Venus:{diameter:6.05e6*2, orbit:(1.09e11+1.07e11)/2},
		Earth:{diameter:6.371e6*2, orbit:1.496e11},
		Moon:{diameter:1.74e6*2, orbit:(3.63e8+4.06e8)/2},
		Mars:{diameter:3.39e6*2, orbit:(2.49e11+2.07e11)/2},
		Jupiter:{diameter:((7.15e7+6.67e7)/2)*2, orbit:(8.17e11+7.41e11)/2},
		Saturn:{diameter:((6.03e7+5.44e7)/2)*2, orbit:(1.51e12+1.35e12)/2},
		Uranus:{diameter:((2.56e7+2.50e7)/2)*2, orbit:(3.00e12+2.74e12)/2},
		Neptune:{diameter:((2.48e7+2.43e7)/2)*2, orbit:(4.55e12+4.45e12)/2},
		Pluto:{diameter:1.20e6*2, orbit:(7.38e12+4.44e12)/2},
		"Iridium Satellite":{diameter:0, orbit:780000 /*высота орбиты над уровнем моря*/},
		"Geostationary Satellite":{diameter:0, orbit:35786000 /*высота орбиты над уровнем моря*/},
		"GPS Satellite":{diameter:0, orbit:20180000},
		"GLONASS Satellite":{diameter:0, orbit:19100000},
		ISS:{diameter:0, orbit:346000 /*высота орбиты над уровнем моря*/},
		Mir:{diameter:0, orbit:389000 /*высота орбиты над уровнем моря*/},
		Skylab:{diameter:0, orbit:438000 /*высота орбиты над уровнем моря*/},
		"Hubble Telescope":{diameter:0, orbit:569000 /*высота орбиты над уровнем моря*/}
	};
	
	var scale = solarSystem.Sun.diameter;// 1e9;
	
	function formatNumber(n){
		if(!n) return "";
		return Math.round((n/scale)*1000)/1000;
	}
	
	function renderTable(){with($H){
		$("#calcScale")[0].value = scale;
		$("#calcPnl")[0].innerHTML = div(
			table({border:1, cellpadding:3, cellspacing:0},
				tr(th("Объект"), th("Диаметр (м)"), th("Диаметр орбиты (м)")),
				apply(solarSystem, function(el, nm){
					return tr(
						td(nm),
						td(formatNumber(el.diameter)),
						td(formatNumber(el.orbit))
					);
				})
			)
		);
	}}
	
	function calc(){
		scale = parseFloat($("#calcScale")[0].value);
		renderTable();
	}
	
	$().ready(function(){
		renderTable();
	});
	
	return {
		calc: calc
	};
})($, Html);