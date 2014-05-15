﻿define(["jspath", "dataSource"], function($JP, dSrc){
	var localDB = {};
	
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
		for(var k in localDB.projects){
			var prj = localDB.projects[k];
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
			$JP.set(localDB, path, data);
		},
		setRegistry: function(prjID, options){
			var obj = $.grep(localDB.registry, function(el, i){return el.id==prjID;});
			if(!obj.length) return;
			$.extend(obj[0], options);
		},
		loadProject: function(prjID, onload){var _=this;
			dSrc.load("projects/"+prjID, function(data){
				$JP.set(localDB, ["projects", prjID], data);
				_.setRegistry(prjID, {frozen: false});
				onload();
			});
		},
		unloadProject: function(prjID, onunload){var _=this;
			$JP.set(localDB, ["projects", prjID], null);
			_.setRegistry(prjID, {frozen: true});
			onunload();
		},
		loadData: function(onload){
			var modules = [
				{file:"queue"},
				{file:"persons"},
				{file:"registry"},
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
					$JP.set(localDB, targetPath, data);
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
			for(var el,i=0; el=localDB.registry[i],i<localDB.registry.length; i++){
				res.push({
					id: el.id,
					color: el.color,
					name: el.name,
					frozen: el.frozen
				});
			}
			return res;
		},
		getProject: function(id){
			var prj = localDB.projects[id];
			prj.id = id;
			return prj;
		},
		getQueue: function(){
			var res = [];
			for(var taskID,i=0; taskID=localDB.queue[i],i<localDB.queue.length; i++){
				var task = taskIndex[taskID];
				if(!task) console.log("missing task "+taskID);
				res.push({name:task.name, id:taskID});
			}
			return res;
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
			
			return search(localDB.projects[prjID], taskID);
		},
		getTaskProject: function(taskID){
			return taskProjects[taskID];
		},
		getTaskPosition: function(taskID){
			var prjID = this.getTaskProject(taskID);
			var prj = localDB.projects[prjID];
			for(var t,i=0; t=prj.tasks[i],i<prj.tasks.length; i++){
				if(t.id==taskID) return i;
			}
		},
		getQueuePosition: function(taskID){
			for(var el,i=0; el=localDB.queue[i],i<localDB.queue.length; i++){
				if(el==taskID) return i;
			}
		},
		removeFromQueue: function(taskID){
			var q = [];
			for(var el,i=0; el=localDB.queue[i],i<localDB.queue.length; i++){
				if(el!=taskID) q.push(el);
			}
			localDB.queue = q;
		},
		setQueuePosition: function(taskID, pos){
			if(pos==null)
				this.removeFromQueue(taskID);
			else if(pos>=localDB.queue.length)
				localDB.queue.push(taskID);
			else {
				var curPos = this.getQueuePosition(taskID);
				if(curPos==pos) return;
				
				this.removeFromQueue(taskID);
				var q1 = [].concat(localDB.queue).splice(0,pos),
					q2 = [].concat(localDB.queue).splice(pos);
				localDB.queue = q1.concat([taskID], q2);
			}
		},
		saveTask: function(data){
			var id = data.id,
				task = taskIndex[id],
				curParent = this.getParent(data.prjID, id),
				newParent = data.parent?taskIndex[data.parent]:localDB.projects[data.prjID];
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
			$.extend(res, localDB.persons);
			for(var k in res){
				res[k].id = k;
			}
			return res;
		},
		getPerson: function(id){
			return localDB.persons[id];
		},
		newTaskID: function(prjID){
			for(var i=1; true; i++){
				var id = prjID+"_"+i;
				if(!taskIndex[id]) return id;
			}
		}
	};
});