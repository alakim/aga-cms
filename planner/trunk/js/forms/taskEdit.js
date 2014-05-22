﻿define(["html", "knockout", "db", "util", "validation", "forms/projectView", "forms/taskSelector", "forms/personSelector"], function($H, ko, db, util, validation, projectView, taskSelector, personSelector){

	function template(data){with($H){
		var newMode = data==null;
		return div(
			div({id:"taskSelector", "class":"hidden panel"}),
			div({id:"personSelector", "class":"hidden panel"}),
			h2("Task Editor"),
			table(
				tr(th("Parent"), td(
					input({type:"text", readonly:true, "data-bind":"value:$parent"}),
					input({type:"button", value:"Select", "data-bind":"click:selectParent"}),
					span({style:"padding-left:25px;", "data-bind":"text:parentName"}),
					util.validMsg("$parent")
				)),
				tr(th("ID"), td(input({type:"text", readonly:true, "data-bind":"value:$id"}))),
				tr(th("Queue position"), td(input({type:"text", "data-bind":"value:$queuePos"}))),
				tr(th("Name"), td(input({type:"text", "data-bind":"value:$name"}), util.validMsg("$name"))),
				tr(th("Date"), td(input({type:"text", "data-bind":"value:$date"}), util.validMsg("$date"))),
				tr(th("Initiator"), td(
					input({type:"text", readonly:true, "data-bind":"value:$initiator"}),
					input({type:"button", value:"Select", "data-bind":"click:selectInitiator"}),
					span({style:"padding-left:25px;", "data-bind":"text:initiatorName"})
				)),
				tr(th("Executor"), td(
					input({type:"text", readonly:true, "data-bind":"value:$executor"}),
					input({type:"button", value:"Select", "data-bind":"click:selectExecutor"}),
					span({style:"padding-left:25px;", "data-bind":"text:executorName"})
				)),
				tr(th("Completed"), td(
					input({type:"text", "data-bind":"value:$completed"}),
					input({type:"button", value:"Now", "data-bind":"click:setCompleted"})
				)),
				tr(th("Jobs"), td(
					// input({type:"text", "data-bind":"value:$jobs"})
					div("count: ", span({"data-bind":"text:$jobs().length"})),
					div({"data-bind":"foreach:{data:$jobs, as:'job'}"},
						div(
							input({type:"text", "data-bind":"value:job.$date"}), ": ",
							input({type:"text", "data-bind":"value:job.$hours"}), "h  ",
							input({type:"text", "data-bind":"value:job.$notes"}), " ",
							input({type:"button", "data-bind":"click: $parent.deleteJob", value:"Delete"})
						)
					),
					
					
					input({type:"button", value:"Add", "data-bind":"click:addJob"}),
					div({style:"margin-left:80px; border:1px solid #ddd; padding:3px;"},
						"date:",input({type:"text", "data-bind":"value:newJobDate"}),
						" hours:",input({type:"text", "data-bind":"value:newJobHours"}),
						" notes:",input({type:"text", "data-bind":"value:newJobNotes"})
					)
				)),
				tr(th("Description"), td(textarea({style:"width:400px; height:150px;", "data-bind":"value:$description"}))),
				tr(td({colspan:2},
					input({type:"button", value:"Cancel", "data-bind":"click:cancel"}), " ",
					input({type:"button", value:"Save", "data-bind":"click:save"}), " ",
					input({type:"button", value:"Delete", "data-bind":"click:deleteTask"})
				))
			)
		);
	}}
	
	function Model(data){var _=this;
		var taskID = data&&data.id?data.id:db.newTaskID(data.prjID);
		var jobs = [];
		if(data&&data.jobs){
			for(var el,i=0; el=data.jobs[i],i<data.jobs.length; i++){
				jobs.push({$date:el.date, $hours:el.hours, $notes:el.notes});
			}
		}
		
		var queuePos = db.getQueuePosition(data.id);
		$.extend(_, {
			$prjID: ko.observable(data?data.prjID:null),
			$parent: ko.observable(data?data.parent:null).extend({condition:{condition:$H.format("x|x!='{0}'", taskID), message:"Задача не может быть вложена сама в себя"}}),
			$id: ko.observable(taskID),
			$name: ko.observable(data?data.name:"").extend({required:"Укажите название задачи"}),
			$date: ko.observable(data?data.date:util.formatDate(new Date())).extend({required:"Укажите дату постановки задачи"}),
			$initiator: ko.observable(data?data.initiator:""),
			$executor: ko.observable(data?data.executor:""),
			$completed: ko.observable(data?data.completed:""),
			$jobs: ko.observableArray(jobs),
			$description: ko.observable(data?data.description:""),
			$queuePos: ko.observable(queuePos==null?"":queuePos+1),
			setCompleted: function(){
				_.$completed(util.formatDate(new Date()));
			},
			addJob: function(){
				var job = {
					$date: _.newJobDate(),
					$hours: _.newJobHours()
				};
				if(_.newJobNotes().length) job.$notes = _.newJobNotes();
				_.$jobs.push(job);
				_.newJobDate(util.formatDate(new Date()));
				_.newJobHours(1);
				_.newJobNotes("");
			},
			deleteJob: function(job){
				_.$jobs.remove(job);
			},
			selectParent: function(){
				taskSelector.view(data.prjID, function(id){
					_.$parent(id);
				});
			},
			selectInitiator: function(){
				personSelector.view(function(id){
					// if(!id.length) id = null;
					_.$initiator(id);
				});
			},
			selectExecutor: function(){
				personSelector.view(function(id){
					// if(!id.length) id = null;
					_.$executor(id);
				});
			},
			cancel: function(){
				require("forms/projectView").view(data.prjID);
			},
			save: function(){
				if(!validation.validate(_)) return;
				var data = util.getModelData(this);
				db.saveTask(data);
				projectView = require("forms/projectView");
				projectView.view(data.prjID);
			},
			deleteTask: function(){
				if(!confirm("Delete this Task?")) return;
				db.delTask(_.$prjID(), _.$id());
				require("forms/projectView").view(data.prjID);
			}
		});
		
		$.extend(_,{
			newJobDate: ko.observable(util.formatDate(new Date())),
			newJobHours: ko.observable(1),
			newJobNotes: ko.observable("")
		});
		
		$.extend(_,{
			parentName: ko.computed(function(){
				if(!_.$parent) return; 
				var id = _.$parent();
				var parent = db.getTask(id);
				return parent?parent.name:"";
			}),
			initiatorName: ko.computed(function(){
				if(!_.$initiator) return; 
				var id = _.$initiator();
				var person = db.getPerson(id);
				return person?person.name:"";
			}),
			executorName: ko.computed(function(){
				if(!_.$executor) return; 
				var id = _.$executor();
				var person = db.getPerson(id);
				return person?person.name:"";
			})
		});

	}
	
	return {
		view: function(prjID, pnl, id){
			var data = id?db.getTask(id):{};
			data.prjID = prjID;
			var parent = db.getParent(prjID, id);
			if(parent && parent.id!=prjID)
				data.parent = parent.id;
			pnl.html(template(data));
			ko.applyBindings(new Model(data), pnl.find("div")[0]);
		}
	};
});