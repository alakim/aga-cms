define(["html", "knockout", "dataSource", "util"], function($H, ko, ds, util){
	function template(data){with($H){
		var newMode = data==null;
		return div(table(
			tr(th("ID"), td(input({type:"text", "data-bind":"value:id"}))),
			tr(th("Name"), td(input({type:"text", "data-bind":"value:name"}))),
			tr(th("Initiator"), td(input({type:"text", "data-bind":"value:initiator"}))),
			tr(th("Completed"), td(
				input({type:"text", "data-bind":"value:completed"}),
				input({type:"button", value:"Now", "data-bind":"click:setCompleted"})
			)),
			tr(th("Jobs"), td(input({type:"text", "data-bind":"value:jobs"}))),
			tr(th("Description"), td(textarea({style:"width:400px; height:150px;", "data-bind":"value:description"}))),
			tr(td({colspan:2},
				// input({type:"button", value:"Cancel", "data-bind":"click:cancel"}),
				input({type:"button", value:"Save", "data-bind":"click:save"})
			))
		));
	}}
	
	function Model(data){
		$.extend(this, {
			id: ko.observable(data?data.id:""),
			name: ko.observable(data?data.name:""),
			initiator: ko.observable(data?data.initiator:""),
			completed: ko.observable(data?data.completed:""),
			jobs: ko.observable(data?data.jobs:""),
			description: ko.observable(data?data.description:""),
			setCompleted: function(){
				this.completed(util.formatDate(new Date()));
			},
			// cancel: function(){},
			save: function(){
			}
		});
	}
	
	return {
		view: function(pnl, id){
			var data = id?ds.getTask(id):null;
			pnl.html(template(data));
			ko.applyBindings(new Model(data), pnl.find("div")[0]);
		}
	};
});