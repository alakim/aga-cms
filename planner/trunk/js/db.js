define(["jspath", "dataSource"], function($JP, dSrc){
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
			//console.log(e != task);
			if(e!=task) res.push(e);
		}
		parent.tasks = res;
		return task;
	}
	
	
	return {
		set: function(path, data){
			$JP.set(dbData, path, data);
		},
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
		getTaskPosition: function(taskID){
			var prjID = this.getTaskProject(taskID);
			var prj = dbData.projects[prjID];
			for(var t,i=0; t=prj.tasks[i],i<prj.tasks.length; i++){
				if(t.id==taskID) return i;
			}
		},
		getQueuePosition: function(taskID){
			for(var el,i=0; el=dbData.queue[i],i<dbData.queue.length; i++){
				if(el==taskID) return i;
			}
		},
		removeFromQueue: function(taskID){
			var q = [];
			for(var el,i=0; el=dbData.queue[i],i<dbData.queue.length; i++){
				if(el!=taskID) q.push(el);
			}
			dbData.queue = q;
		},
		setQueuePosition: function(taskID, pos){
			if(pos==null)
				this.removeFromQueue(taskID);
			else if(pos>=dbData.queue.length)
				dbData.queue.push(taskID);
			else {
				var curPos = this.getQueuePosition(taskID);
				if(curPos==pos) return;
				
				this.removeFromQueue(taskID);
				var q1 = [].concat(dbData.queue).splice(0,pos),
					q2 = [].concat(dbData.queue).splice(pos);
				dbData.queue = q1.concat([taskID], q2);
			}
		},
		saveTask: function(data){
			var id = data.id,
				task = taskIndex[id],
				curParent = this.getParent(data.prjID, id),
				newParent = data.parent?taskIndex[data.parent]:dbData.projects[data.prjID];
			//console.log(curParent?curParent.id:"no parent", " to ", data.parent);
			if(!task){
				task = {id:id};
				taskIndex[id] = task;
			}
			if(!curParent){
				$JP.push(newParent, "tasks", task);
			}
			else if(curParent /*&& curParent.id!=data.prjID*/ && curParent.id!=data.parent){
				//console.log("moving from "+curParent.id +" to "+data.parent);
				removeTask(curParent, task);
				$JP.push(newParent, "tasks", task);
			}
			this.setQueuePosition(data.id, data.queuePos==null?null:data.queuePos-1);
			for(var k in data){
				if(k!="prjID" && k!="parent" && k!="queuePos")
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