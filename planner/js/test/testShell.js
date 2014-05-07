define(["jquery", "html"], function($, $H) {
	var tests = [],
		testGroups = [];
	
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
	
	function Test(name, action){var _=this;
		$.extend(_,{
			name:name,
			action:action
		});
		tests.push(_);
		_.errors = [];
		_.logError = function(msg){
			getLogPanel().append($H.div({"class":"message"}, _.name+": "+$H.span({"class":"error"}, msg)));
		}
		_.logSuccess = function(msg){
			getLogPanel().append($H.div({"class":"message"}, _.name+": "+$H.span({"class":"success"}, msg||"OK")));
		}
		_.assert = function(val, expected, msg){
			if(val!=expected) _.errors.push($H.format("Expected {0}, but was {1}", expected, val));
		}
		_.run = function(noGroup){
			if(_.group && noGroup) return;
			var err = this.action(this.assert) || "";
			err+=this.errors.join("<br/>");
			if(err.length) this.logError("Error: "+err);
			else this.logSuccess();
		}
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