define(["jspath", "test/db"], function($JP, db){
	var timeout = 200;
	
	var taskIndex = {};
	function indexTasks(){
		for(var k in db.projects){
			var prj = db.projects[k];
			if(prj.tasks) indexTaskList(prj.tasks);
		}
	}
	
	function indexTaskList(tasks){
		$.each(tasks, function(i, t){
			taskIndex[t.id] = t;
			if(t.tasks) indexTaskList(t.tasks);
		});
	}
	
	indexTasks();
	
	
	return {
		getProjects: function(){
			var res = [];
			for(var id in db.projects){
				var prj = db.projects[id],
					data = {id:id, name:prj.name};
				if(prj.color) data.color = prj.color;
				res.push(data);
			}
			return res;
		},
		getProject: function(id){
			var prj = db.projects[id];
			prj.id = id;
			return prj;
		},
		getQueue: function(){
			var res = [];
			for(var taskID,i=0; taskID=db.queue[i],i<db.queue.length; i++){
				var task = taskIndex[taskID];
				if(!task) console.log("missing task "+taskID);
				res.push({name:task.name, id:taskID});
			}
			return res;
		},
		loadProject: function(name){
			console.log(name+" loaded!");
		},
		getTask: function(id){
			return taskIndex[id];
		},
		saveTask: function(data){
			var id = data.id,
				task = taskIndex[id];
			if(!task){
				task = {id:id};
				taskIndex[id] = task;
				$JP.push(data.parent?taskIndex[data.parent]:db.projects[data.prjID], "tasks", task);
			}
			for(var k in data){
				if(k!="prjID" && k!="parent")
					task[k] = data[k];
			}
		},
		getPersons: function(){
			var res = {};
			$.extend(res, db.persons);
			for(var k in res){
				res[k].id = k;
			}
			return res;
		},
		getPerson: function(id){
			return db.persons[id];
		},
		newTaskID: function(prjID){
			for(var i=1; true; i++){
				var id = prjID+"_"+i;
				if(!taskIndex[id]) return id;
			}
		},
		getPerson: function(id){
			return db.persons[id];
			
		}
	};
});