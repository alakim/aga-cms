define(["test/testShell", "util", "db"], function(shell, util, db) {
	new shell.TestGroup("Util Tests", [
		new shell.Test("Getting Model Data", function(assert){
			var model = {
				$fio: "Иванов И.И.",
				$phone: "444-4444",
				$ages: 30,
				$jobs:[
					{$name:"Разработка каталога", $hours:3},
					{$name:"Отладка ПО", $hours:1}
				]
			};
			var data = util.getModelData(model);
			
			assert(data.fio, model.$fio);
			assert(data.phone, model.$phone);
			assert(data.ages, model.$ages);
			
			assert(data.jobs[0].name, model.$jobs[0].$name);
			assert(data.jobs[0].hours, model.$jobs[0].$hours);
			
			assert(data.jobs[1].name, model.$jobs[1].$name);
			assert(data.jobs[1].hours, model.$jobs[1].$hours);
		})
	]);

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
		
		new shell.Test("Queue Position", function(assert){
			assert(db.getQueuePosition("gss_1"), 0);
			assert(db.getQueuePosition("grossblock_3"), 1);
			assert(db.getQueuePosition("portal_2"), 2);
			assert(db.getQueuePosition("aga_1"), 3);
		}),
		
		new shell.Test("Setting Queue Position", function(assert){
			db.setQueuePosition("gss_1", null);
			assert(db.getQueuePosition("gss_1"), null);
			db.setQueuePosition("gss_1", 1);
			assert(db.getQueuePosition("gss_1"), 1);
			db.setQueuePosition("gss_1", 2);
			assert(db.getQueuePosition("gss_1"), 2);
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
		new shell.Test("Getting Task Position", function(assert){
			assert(db.getTaskPosition("gss_1"), 0);
			assert(db.getTaskPosition("gss_2"), 1);
			assert(db.getTaskPosition("gss_3"), 2);
		}),
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
			assert(db.getTaskPosition("gss_1"), 0);
		}),
		new shell.Test("Moving Task", function(assert){
			var taskData = {
				prjID: "gss",
				id: "gss_1",
				name: "Залить новости!!",
				parent: "gss_2"
			};
			
			db.saveTask(taskData);
			var task = db.getTask(taskData.id);
			assert(task.name, taskData.name);
			assert(db.getParent("gss", taskData.id).id, taskData.parent, "Bad parent");
			
			taskData.parent = null;
			db.saveTask(taskData);
			assert(db.getParent("gss", taskData.id).name, "ГСС", "Bad parent");
		}),
		new shell.Test("Adding Task", function(assert){
			var taskData = {
				prjID: "gss",
				id: "gss_4",
				name: "Залить новости!!"
			};
			db.saveTask(taskData);
			var task = db.getTask(taskData.id);
			assert(task.name, taskData.name);
			var parent = db.getParent("gss", taskData.id);
			assert(parent!=null, true, "No parent");
			if(parent) assert(parent.name, "ГСС", "Bad parent");
		})
	]);
	
	return {
		run: shell.run
	};
});