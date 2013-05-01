function Cdk(kyStr){var _=this;
	_.ky = _._gtCds(kyStr);
}

Cdk.prototype = {
	_cpg0: "3456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
	_cpg:  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ[],. 0123456789`~!@#$%^&*()_+-=;:<>/?{}|\\\'\" אבגדהו¸זחטיךכלםמןנסעףפץצקרשתûü‎‏ÿÀÁÂÃÄÅ¨ÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞ‗¹\n\r\t",
	
	_gtCds: function(str, p0){var _=this;
		function gcd(c){
			var cp = p0?_._cpg0:_._cpg;
			for(var i=0;i<cp.length;i++){
				if(c==cp.charAt(i))
					return i;
			}
			return -1;
		}
		var a = [];
		for(var i=0;i<str.length;i++){
			var c = str.charAt(i);
			if(p0 && (c.match(/[012]/))){
				a.push(c);
			}
			else
				a.push(gcd(c));
		}
		return a;
	},
	
	ec: function(str, rev){var _=this;
		var out = [];
		str = _._gtCds(str, rev);
		var cpNr = 0;
		for(var i=0,j=0;i<str.length;i++,j++){
			if(j>=_.ky.length)
				j = 0;
			if(rev && typeof(str[i])=="string"){
				cpNr = parseInt(str[i]);
				i++;
			}
			var c; 
			if(rev){
				c = (str[i] - _.ky[j])+cpNr*(_._cpg0.length-1);
			}
			else{
				c = str[i] + _.ky[j];
			}
			if(c>=_._cpg.length)
				c-=_._cpg.length;
			if(c<0)
				c+=_._cpg.length;
			var c0 = c%(_._cpg0.length-1);
			var cpN0 = Math.floor(c/(_._cpg0.length-1));
			if(!rev && cpNr!=cpN0){
				out.push(""+cpN0);
				cpNr = cpN0;
			}
			if(rev)
				out.push(_._cpg.charAt(c));
			else
				out.push(_._cpg0.charAt(c0));
		}
		return out.join("");
	}
	
}