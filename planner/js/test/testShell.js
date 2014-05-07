define(["jquery", "html"], function($, $H) {
	var tests = [];
	
	function Test(name, action){
		$.extend(this,{
			name:name,
			action:action
		});
		tests.push(this);
		
		this.logError = function(msg){
			getLogPanel().append($H.div({"class":"message error"}, this.name+": "+msg));
		}
		this.logSuccess = function(msg){
			getLogPanel().append($H.div({"class":"message success"}, this.name+": "+(msg||"OK")));
		}
	}
	
	function getLogPanel(){
		return $("#out");
	}
	
	function runTests(){
		$.each(tests, function(i, test){
			var err = test.action();
			if(err) test.logError("Error: "+err);
			else test.logSuccess();
		});
	}
	
	
	return {
		Test: Test,
		run: runTests
	};
});