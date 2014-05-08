define(["jspath", "test/dbData", "dataSource"], function($JP, dbData, dSrc){
	var dbData = {};
	
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
		for(var k in dbData.projects){
			var prj = dbData.projects[k];
			if(prj.tasks) indexTaskList(k, prj.tasks);
		}
	}
	
	
	
	function removeTask(parent, task){
		var res = [];
		var tasks = parent.tasks;
		for(var e,i=0; e=tasks[i],i<tasks.length; i++){
			console.log(e != task);
			if(e!=task) res.push(e);
		}
		parent.tasks = res;
		return task;
	}
	
	
	return {
		loadData: function(onload){
			var modules = [
				{file:"queue"},
				{file:"persons"},
				{file:"projects"}
			];
			
			function allLoaded(){
				for(var m,i=0; m=modules[i],i<modules.length; i++){
					if(!m.loaded) return false;
				}
				return true;
			}
			
			function load(module){
				var file = module.file,
					targetPath = module.path;
				targetPath = targetPath || file;
				module.loaded = false;
				dSrc.load(file, function(data){
					$JP.set(dbData, targetPath, data);
					module.loaded = true;
					if(allLoaded()){
						indexTasks();
						onload();
					}
				})
			}
			
			for(var m,i=0; m=modules[i],i<modules.length; i++){
				load(m);
			}
			
		},
		getProjects: function(){
			var res = [];
			for(var id in dbData.projects){
				var prj = dbData.projects[id],
					data = {id:id, name:prj.name};
				if(prj.color) data.color = prj.color;
				res.push(data);
			}
			return res;
		},
		getProject: function(id){
			var prj = dbData.projects[id];
			prj.id = id;
			return prj;
		},
		getQueue: function(){
			var res = [];
			for(var taskID,i=0; taskID=dbData.queue[i],i<dbData.queue.length; i++){
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
				if(!parent) return;
				var list = parent.tasks;
				if(!list || list.length==0) return;
				for(var el, i=0; el=list[i],i<list.length; i++){
					if(el.id==id) return parent;
					var p = search(el, id);
					if(p) return p;
				}
			}
			
			return search(dbData.projects[prjID], taskID);
		},
		getTaskProject: function(taskID){
			return taskProjects[taskID];
		},
		saveTask: function(data){
			var id = data.id,
				task = taskIndex[id],
				curParent = this.getParent(data.prjID, id),
				newParent = data.parent?taskIndex[data.parent]:dbData.projects[data.prjID];
			console.log(curParent?curParent.id:"no parent", " to ", data.parent);
			if(!task){
				task = {id:id};
				taskIndex[id] = task;
			}
			if(curParent && curParent.id!=data.parent){
				removeTask(curParent, task);
				$JP.push(newParent, "tasks", task);
			}
			for(var k in data){
				if(k!="prjID" && k!="parent")
					task[k] = data[k];
			}
		},
		getPersons: function(){
			var res = {};
			$.extend(res, dbData.persons);
			for(var k in res){
				res[k].id = k;
			}
			return res;
		},
		getPerson: function(id){
			return dbData.persons[id];
		},
		newTaskID: function(prjID){
			for(var i=1; true; i++){
				var id = prjID+"_"+i;
				if(!taskIndex[id]) return id;
			}
		}
	};
});