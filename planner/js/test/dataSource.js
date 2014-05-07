define(["jspath", "test/db"], function($JP, db){
	var timeout = 200;
	
	var taskIndex = {},
		taskProjects = {};
	function indexTasks(){
		function indexTaskList(prjID, tasks){
			$.each(tasks, function(i, t){
				taskIndex[t.id] = t;
				taskProjects[t.id] = prjID;
				if(t.tasks) indexTaskList(prjID, t.tasks);
			});
		}
		for(var k in db.projects){
			var prj = db.projects[k];
			if(prj.tasks) indexTaskList(k, prj.tasks);
		}
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
		getParent: function(prjID, taskID){
			function search(parent, id){
				var list = parent.tasks;
				if(!list || list.length==0) return;
				for(var el, i=0; el=list[i],i<list.length; i++){
					if(el.id==id) return parent;
					var p = search(el, id);
					if(p) return p;
				}
			}
			
			return search(db.projects[prjID], taskID);
		},
		getTaskProject: function(taskID){
			return taskProjects[taskID];
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