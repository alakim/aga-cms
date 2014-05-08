define(["test/testShell", "util", "db"], function(shell, util, db) {

	new shell.TestGroup("Simple Tests", [
		new shell.Test("Project List", function(assert){
			var list = db.getProjects();
			assert(list.length, 9);
			assert(list[0].name, "ГСС");
			assert(list[0].id, "gss");
			assert(list[0].color, "#088");
			assert(list[1].name, "Порт 2");
			assert(list[1].id, "port2");
		}),
		
		new shell.Test("Queue", function(assert){
			var list = db.getQueue();
			assert(list.length, 4);
			assert(list[0].name, "Залить новости");
			assert(list[0].id, "gss_1");
		}),
		
		new shell.Test("Getting Parent", function(assert){
			assert(db.getParent("gss", "gss_1").name, "ГСС");
			assert(db.getParent("grossblock", "grossblock_1").id, "grossblock_2");
			assert(db.getParent("grossblock", "grossblock_1x"), null);
			assert(db.getParent("grossblockx", "grossblock_1"), null);
		}),
		
		new shell.Test("Getting Task Project ID", function(assert){
			assert(db.getTaskProject("gss_1"), "gss");
		}),
		
		new shell.Test("Getting Persons List", function(assert){
			var persons = db.getPersons();
			assert(util.getDictSize(persons), 8);
			assert(persons["KKA"].name, "Калинников К.М.");
		}),
		
		new shell.Test("Generating new Task ID", function(assert){
			var id = db.newTaskID("gss");
			assert(id, "gss_4");
		})
	]);
	
	new shell.TestGroup("Task Editig Tests", [
		new shell.Test("Saving Task", function(assert){
			var taskData = {
				prjID: "gss",
				id: "gss_1",
				name: "Залить новости!!!"
			};
			
			db.saveTask(taskData);
			var task = db.getTask(taskData.id);
			assert(task.name, taskData.name);
			assert(db.getParent("gss", taskData.id).name, "ГСС");
		}),
		new shell.Test("Moving Task", function(assert){
			var taskData = {
				prjID: "gss",
				id: "gss_1",
				name: "Залить новости!!!",
				parent: "gss_2"
			};
			
			db.saveTask(taskData);
			var task = db.getTask(taskData.id);
			assert(task.name, taskData.name);
			assert(db.getParent("gss", taskData.id).id, taskData.parent, "Bad parent");
		})
	]);
	
	return {
		run: shell.run
	};
});