define(["jquery", "html"], function($, $H) {
	var tests = [];
	
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
	}
	
	function getLogPanel(){
		return $("#out");
	}
	
	function runTests(){
		$.each(tests, function(i, test){
			var err = test.action(test.assert) || "";
			err+=test.errors.join("<br/>");
			if(err.length) test.logError("Error: "+err);
			else test.logSuccess();
		});
	}
	
	
	return {
		Test: Test,
		run: runTests
	};
});