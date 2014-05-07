define(["test/testShell", "util", "dataSource"], function(shell, util, ds) {

	new shell.TestGroup("Simple Tests", [
		new shell.Test("Project List", function(assert){
			var list = ds.getProjects();
			assert(list.length, 9);
			assert(list[0].name, "ГСС");
			assert(list[0].id, "gss");
			assert(list[0].color, "#088");
			assert(list[1].name, "Порт 2");
			assert(list[1].id, "port2");
		}),
		
		new shell.Test("Queue", function(assert){
			var list = ds.getQueue();
			assert(list.length, 4);
			assert(list[0].name, "Залить новости");
			assert(list[0].id, "gss_1");
		}),
		
		new shell.Test("Getting Parent", function(assert){
			assert(ds.getParent("gss", "gss_1").name, "ГСС");
			assert(ds.getParent("grossblock", "grossblock_1").id, "grossblock_2");
			assert(ds.getParent("grossblock", "grossblock_1x"), null);
			assert(ds.getParent("grossblockx", "grossblock_1"), null);
		}),
		
		new shell.Test("Getting Task Project ID", function(assert){
			assert(ds.getTaskProject("gss_1"), "gss");
		}),
		
		new shell.Test("Getting Persons List", function(assert){
			var persons = ds.getPersons();
			assert(util.getDictSize(persons), 8);
			assert(persons["KKA"].name, "Калинников К.М.");
		}),
		
		new shell.Test("Generating new Task ID", function(assert){
			var id = ds.newTaskID("gss");
			assert(id, "gss_4");
		})
	]);
	
	new shell.TestGroup("Saving Task Tests", [
		new shell.Test("Savint Task", function(assert){
			return "Not implemented";
			//assert(ds.saveTask(), null);
		})
	]);
	
	return {
		run: shell.run
	};
});