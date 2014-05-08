define(["html", "knockout", "db", "util", "validation", "forms/projectView", "forms/taskSelector", "forms/personSelector"], function($H, ko, db, util, validation, projectView, taskSelector, personSelector){
	
	function template(data){with($H){
		var newMode = data==null;
		return div(
			div({id:"taskSelector", "class":"hidden panel"}),
			div({id:"personSelector", "class":"hidden panel"}),
			table(
				tr(th("Parent"), td(
					input({type:"text", readonly:true, "data-bind":"value:$parent"}),
					input({type:"button", value:"Select", "data-bind":"click:selectParent"}),
					span({style:"padding-left:25px;", "data-bind":"text:parentName"}),
					util.validMsg("$parent")
				)),
				tr(th("ID"), td(input({type:"text", readonly:true, "data-bind":"value:$id"}))),
				tr(th("Name"), td(input({type:"text", "data-bind":"value:$name"}), util.validMsg("$name"))),
				tr(th("Initiator"), td(
					input({type:"text", readonly:true, "data-bind":"value:$initiator"}),
					input({type:"button", value:"Select", "data-bind":"click:selectInitiator"}),
					span({style:"padding-left:25px;", "data-bind":"text:initiatorName"})
				)),
				tr(th("Completed"), td(
					input({type:"text", "data-bind":"value:$completed"}),
					input({type:"button", value:"Now", "data-bind":"click:setCompleted"})
				)),
				tr(th("Jobs"), td(input({type:"text", "data-bind":"value:jobs"}))),
				tr(th("Description"), td(textarea({style:"width:400px; height:150px;", "data-bind":"value:$description"}))),
				tr(td({colspan:2},
					input({type:"button", value:"Cancel", "data-bind":"click:cancel"}), " ",
					input({type:"button", value:"Save", "data-bind":"click:save"})
				))
			)
		);
	}}
	
	function Model(data){var _=this;
		var taskID = data&&data.id?data.id:db.newTaskID(data.prjID);
		$.extend(_, {
			$prjID: ko.observable(data?data.prjID:null),
			$parent: ko.observable(data?data.parent:null).extend({condition:{condition:$H.format("x|x!='{0}'", taskID), message:"Задача не может быть вложена сама в себя"}}),
			$id: ko.observable(taskID),
			$name: ko.observable(data?data.name:"").extend({required:"Укажите название задачи"}),
			$initiator: ko.observable(data?data.initiator:""),
			$completed: ko.observable(data?data.completed:""),
			jobs: ko.observable(data?data.jobs:""),
			$description: ko.observable(data?data.description:""),
			setCompleted: function(){
				_.$completed(util.formatDate(new Date()));
			},
			selectParent: function(){
				taskSelector.view(data.prjID, function(id){
					_.$parent(id);
				});
			},
			selectInitiator: function(){
				personSelector.view(function(id){
					_.$initiator(id);
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
			}
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