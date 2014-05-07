define(["html", "knockout", "dataSource", "util", "forms/taskSelector"], function($H, ko, ds, util, taskSelector){
	function template(data){with($H){
		var newMode = data==null;
		return div(
			div({id:"taskSelector", "class":"hidden panel"}),
			table(
				tr(th("Parent"), td(
					input({type:"text", "data-bind":"value:$parent"}),
					input({type:"button", value:"Select", "data-bind":"click:selectParent"})
				)),
				tr(th("ID"), td(input({type:"text", "data-bind":"value:$id"}))),
				tr(th("Name"), td(input({type:"text", "data-bind":"value:$name"}))),
				tr(th("Initiator"), td(input({type:"text", "data-bind":"value:$initiator"}))),
				tr(th("Completed"), td(
					input({type:"text", "data-bind":"value:$completed"}),
					input({type:"button", value:"Now", "data-bind":"click:setCompleted"})
				)),
				tr(th("Jobs"), td(input({type:"text", "data-bind":"value:jobs"}))),
				tr(th("Description"), td(textarea({style:"width:400px; height:150px;", "data-bind":"value:$description"}))),
				tr(td({colspan:2},
					// input({type:"button", value:"Cancel", "data-bind":"click:cancel"}),
					input({type:"button", value:"Save", "data-bind":"click:save"})
				))
			)
		);
	}}
	
	function Model(data){
		$.extend(this, {
			prjID: ko.observable(data?data.prjID:null),
			$parent: ko.observable(data?data.parent:null),
			$id: ko.observable(data?data.id:""),
			$name: ko.observable(data?data.name:""),
			$initiator: ko.observable(data?data.initiator:""),
			$completed: ko.observable(data?data.completed:""),
			jobs: ko.observable(data?data.jobs:""),
			$description: ko.observable(data?data.description:""),
			setCompleted: function(){
				this.completed(util.formatDate(new Date()));
			},
			selectParent: function(){var _=this;
				taskSelector.view(data.prjID, function(id){
					_.$parent(id);
				});
			},
			// cancel: function(){},
			save: function(){
				var data = util.getModelData(this);
				console.log("Saved ", data);
			}
		});
	}
	
	return {
		view: function(prjID, pnl, id){
			var data = id?ds.getTask(id):{};
			data.prjID = prjID;
			pnl.html(template(data));
			ko.applyBindings(new Model(data), pnl.find("div")[0]);
		}
	};
});