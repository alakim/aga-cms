define(["jquery", "html", "jsflow"], function($, $H, flow) {
	var tests = [],
		testGroups = [];
		
	function testEnabled(testID){
		var h = document.location.hash.slice(1);
		if(!h.length) return true;
		var mt = h.match(/\+(\d+)/g),
			std = "+"+testID;
		for(var m,i=0; m=mt[i],i<mt.length; i++){
			if(m==std) return true;
		}
		return false;
	}
	
	function TestGroup(name, testList){var _=this;
		$.extend(_,{
			name: name,
			testList: testList,
			run: function(){
				getLogPanel().append($H.h2(_.name));
				$.each(_.testList, function(i, test){
					test.run();
				});
				getLogPanel().append($H.hr());
			}
		});
		testGroups.push(_);
		$.each(testList, function(i, test){
			test.group = _;
		});
	}
	
	function Test(name, action, async){var _=this;
		$.extend(_,{
			name:name,
			action:action,
			async: async||false
		});
		tests.push(_);
		_.id = tests.length;
		_.errors = [];
		_.logError = function(msg){
			getLogPanel().append($H.div({"class":"message"}, _.id+": "+_.name+": "+$H.span({"class":"error"}, msg)));
		};
		_.logSuccess = function(msg){
			getLogPanel().append($H.div({"class":"message"}, _.id+": "+_.name+": "+$H.span({"class":"success"}, msg||"OK")));
		};
		_.assert = function(val, expected, msg){
			msg = msg || "";
			if(val!=expected) _.errors.push($H.format("***{2}*** Expected {0}, but was {1}", expected, val, msg));
		};
		_.report = function(err){
			err = err || "";
			err+=_.errors.join("<br/>");
			if(err.length) _.logError("Error: "+err);
			else _.logSuccess();
		};
		_.run = function(noGroup){
			if(_.group && noGroup) return;
			if(!testEnabled(this.id)){
				log($H.span({"class":"disabled"}, this.id+": "+this.name+" disabled"));
				return;
			}
			var err = this.action(this.assert, this.report) || "";
			if(!async) this.report();
		};
	}
	
	function getLogPanel(){
		return $("#out");
	}
	
	
	function log(msg){
		getLogPanel().append($H.div({"class":"message"}, msg));
	}
	
	
	return {
		Test: Test,
		TestGroup: TestGroup,
		run: function(){
			$.each(testGroups, function(i, group){group.run();});
			//log("<hr>");
			$.each(tests, function(i, test){test.run(true);});
		},
		log: log
	};
});