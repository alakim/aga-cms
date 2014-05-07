define(["test/testShell", "dataSource"], function(shell, ds) {

	new shell.Test("Project List", function(assert){
		var list = ds.getProjects();
		assert(list.length, 9);
		assert(list[0].name, "ГСС");
		assert(list[0].id, "gss");
		assert(list[0].color, "#088");
		assert(list[1].name, "Порт 2");
		assert(list[1].id, "port2");
	});
	
	new shell.Test("Queue", function(assert){
		var list = ds.getQueue();
		assert(list.length, 4);
		assert(list[0].name, "Залить новости");
		assert(list[0].id, "gss_1");
	});
	
	new shell.Test("Getting Parent", function(assert){
		assert(ds.getParent("gss", "gss_1").name, "ГСС");
		assert(ds.getParent("grossblock", "grossblock_1").id, "grossblock_2");
	});
	
	return {
		run: shell.run
	};
});