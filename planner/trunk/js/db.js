define(["jspath", "dataSource"], function($JP, dSrc){
	var localDB = {};
	
	var taskIndex = {},
		taskProjects = {};
		
	function indexTasks(){
		taskIndex = {};
		taskProjects = {};
		function indexTaskList(prjID, tasks){
			$.each(tasks, function(i, t){
				taskIndex[t.id] = t;
				taskProjects[t.id] = prjID;
				if(t.tasks) indexTaskList(prjID, t.tasks);
			});
		}
		for(var k in localDB.projects){
			var prj = localDB.projects[k];
			if(!prj)continue;
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
		getJSON: function(){
			return JSON.stringify(localDB);
		},
		setJSON: function(jsonCode){
			var data = $.parseJSON(jsonCode);
			localDB = data;
		},
		set: function(path, data){
			$JP.set(localDB, path, data);
		},
		get: function(path){
			return $JP.get(localDB, path);
		},
		setRegistry: function(prjID, options){
			var prj = this.getRegistryItem(prjID);
			if(prj) $.extend(prj, options);
		},
		getRegistryItem: function(prjID){
			// console.log(localDB.registry);
			var obj = $.grep(localDB.registry, function(el, i){return el.id==prjID;});
			return obj.length?obj[0]:null;
		},
		delRegistryItem: function(prjID){
			var res = [];
			for(var el,c=localDB.registry,i=0; el=c[i],i<c.length; i++){
				if(el.id!=prjID) res.push(el);
			}
			localDB.registry = res;
		},
		saveRegistryItem: function(data){
			var itm = this.getRegistryItem(data.id);
			if(!itm) {
				itm = {id:data.id, frozen:true};
				localDB.registry.push(itm);
				// localDB.projects[data.id] = {name:data.name};
			}
			
			for(var k in data){
				if(k!="id") itm[k] = data[k];
			}
		},
		loadProject: function(prjID, onload){var _=this;
			dSrc.load("projects/"+prjID, false, function(data){
				if(!data.name){
					data.name = _.getRegistryItem(prjID).name;
				}
				$JP.set(localDB, ["projects", prjID], data);
				localDB.projects[prjID].changed = false;
				_.setRegistry(prjID, {frozen: false});
				indexTasks();
				onload();
			});
		},
		unloadProject: function(prjID, onunload){var _=this;
			$JP.set(localDB, ["projects", prjID], null);
			_.setRegistry(prjID, {frozen: true});
			indexTasks();
			onunload();
		},
		saveProject: function(prjID, onsave){var _=this;
			dSrc.save("projects/"+prjID, localDB.projects[prjID], function(){
				$JP.set(localDB, ["projects", prjID, "changed"], false);
				onsave();
			});
		},
		saveQueue: function(onsave){
			dSrc.save("queue", localDB.queue, function(){
				onsave();
			});
		},
		saveAll: function(){
			var modules = [
				{file:"queue", data:localDB.queue},
				{file:"persons", data:localDB.persons},
				{file:"registry", data:localDB.registry}
			];
			$.each(localDB.registry, function(i, itm){
				if(itm.frozen) return;
				modules.push({file:"projects/"+itm.id, data:localDB.projects[itm.id]});
			});
			
			function save(){
				if(!modules.length) return;
				var mod = modules.pop();
				// console.log("Saving "+mod.file+" ...");
				dSrc.save(mod.file, mod.data, save);
			}
			
			for(var k in localDB.projects){
				var prj = localDB.projects[k];
				if(prj) prj.changed = false;
			}
			
			save();
		},
		loadData: function(onload){
			// console.log("Loading Data...")
			var modules = [
				{file:"queue", arrMode:true},
				{file:"persons"},
				{file:"registry", arrMode:true}
			];
			
			function allLoaded(){
				for(var m,i=0; m=modules[i],i<modules.length; i++){
					if(!m.loaded) return false;
				}
				return true;
			}
			
			function load(module, prjMode){
				// console.log("loading "+module.file);
				var file = module.file,
					targetPath = module.path;
				targetPath = targetPath || file;
				module.loaded = false;
				dSrc.load(file, module.arrMode, function(data){
					$JP.set(localDB, targetPath, data);
					if(prjMode) $JP.set(localDB, [targetPath, "changed"], false);
					module.loaded = true;
					if(allLoaded()){
						indexTasks();
						if(prjMode){
							onload();
							// console.log("Data Loaded!")
						}
						else
							loadProjects();
					}
				})
			}
			
			for(var m,i=0; m=modules[i],i<modules.length; i++){
				load(m);
			}
			
			function loadProjects(){
				modules = [];
				if(!localDB.registry) localDB.registry = [];
				
				$.each(localDB.registry, function(i, el){
					if(!el.frozen)
						modules.push({file:"projects/"+el.id});
				});
				if(!modules.length){
					onload();
					// console.log("2 Data Loaded!")
				}
				else{
					for(var m,i=0; m=modules[i],i<modules.length; i++){
						load(m, true);
					}
				}
			}
		},
		getBranch: function(path){
			return $JP.get(localDB, path);
		},
		getProjects: function(){
			var res = [];
			for(var el,i=0; el=localDB.registry[i],i<localDB.registry.length; i++){
				res.push({
					id: el.id,
					color: el.color,
					name: el.name,
					frozen: el.frozen,
					changed: el.frozen || (localDB.projects[el.id] && localDB.projects[el.id].changed)
				});
			}
			return res;
		},
		getProject: function(id){
			var prj = localDB.projects[id];
			prj.id = id;
			return prj;
		},
		deleteProject: function(id){
			$JP.set(localDB, ["projects", id], null);
			this.delRegistryItem(id);
			indexTasks();
		},
		getQueue: function(){
			var res = [];
			for(var taskID,i=0; taskID=localDB.queue[i],i<localDB.queue.length; i++){
				var task = taskIndex[taskID];
				// if(!task) console.log("missing task "+taskID);
				if(task)
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
			if(pos==null || pos.length==0)
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
			//console.log(data);
			var id = data.id,
				task = taskIndex[id],
				curParent = this.getParent(data.prjID, id),
				project = localDB.projects[data.prjID],
				newParent = data.parent?taskIndex[data.parent]:project;
			//console.log(curParent?curParent.id:"no parent", " to ", data.parent);
			if(!task){
				task = {id:id};
				taskIndex[id] = task;
				taskProjects[id] = data.prjID;
			}
			if(!curParent){
				$JP.push(newParent, "tasks", task);
			}
			else if(curParent /*&& curParent.id!=data.prjID*/ && curParent.id!=data.parent){
				//console.log("moving from "+curParent.id +" to "+data.parent);
				removeTask(curParent, task);
				$JP.push(newParent, "tasks", task);
			}
			this.setQueuePosition(data.id, (data.queuePos==null || data.queuePos.length==0)?null:data.queuePos-1);
			for(var k in data){
				if(k!="prjID" && k!="parent" && k!="queuePos")
					task[k] = data[k];
			}
			project.changed = true;
		},
		delTask: function(prjID, taskID){
			removeTask(
				this.getParent(prjID, taskID), 
				taskIndex[taskID]
			);
			$JP.set(localDB, ["projects", prjID, "changed"], true);
			indexTasks();
		},
		getPersons: function(){
			var res = {};
			$.extend(res, localDB.persons);
			for(var k in res){
				res[k].id = k;
			}
			return res;
		},
		getPersonRefs: function(prsID){
			var refs = {tasksInitialized:[], tasksExecuted:[]};
			for(var k in taskIndex){
				var task = taskIndex[k];
				if(task.initiator==prsID)
					refs.tasksInitialized.push(task.id);
				if(task.executor==prsID)
					refs.tasksExecuted.push(task.id);
			}
			return refs;
		},
		getPerson: function(id){
			return localDB.persons[id];
		},
		savePerson: function(data){
			var person = localDB.persons[data.id];
			if(!person){
				person = {};
				localDB.persons[data.id] = person;
			}
			for(var k in data){
				if(k!="id")
					person[k] = data[k];
			}
		},
		deletePerson: function(prsID){
			var persons = {};
			for(var k in localDB.persons){
				if(k!=prsID)
					persons[k] = localDB.persons[k];
			}
			localDB.persons = persons;
		},
		newTaskID: function(prjID){
			for(var i=1; true; i++){
				var id = prjID+"_"+i;
				if(!taskIndex[id]) return id;
			}
		},
		getResource: function(prjID, resID){
			return $JP.get(localDB, ["projects", prjID, "resources", resID]);
		},
		saveResource: function(prjID, data){
			$JP.set(localDB, ["projects", prjID, "resources", data.id], data);
		},
		getJobReport: function(){
			var report = [];
			for(var id in taskIndex){var task = taskIndex[id];
				if(!task.jobs) continue;
				$.each(task.jobs, function(i, job){
					report.push({
						id: id,
						name: task.name,
						date: job.date,
						hours: job.hours,
						notes: job.notes
					})
				});
			}
			report.sort(function(t1,t2){
				return t1.date==t2.date?0:t1.date<t2.date?-1:1;
			});
			return report;
		}
	};
});