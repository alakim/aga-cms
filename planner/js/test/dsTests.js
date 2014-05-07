define(["test/testShell"], function(shell) {

	new shell.Test("Sample Test 1", function(){
		return null;
	});
	new shell.Test("Sample Test 2", function(){
		return "Test Error";
	});
	
	
	return {
		run: shell.run
	};
});