define(["test/db"], function(db){
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
				res.push({id:id, name:db.projects[id].name});
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
		getPerson: function(id){
			return db.persons[id];
			
		}
	};
});