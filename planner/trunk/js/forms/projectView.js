define(["jquery", "html", "db", "util", "forms/taskEdit", "forms/taskView", "forms/resourceEdit", "forms/personView", "forms/resourceView", "forms/projectPropEditor"], function($, $H, db, util, taskEdit, taskView, resourceEdit, personView, resourceView, projectPropEditor){

	var templates = {
		main: function(prj){with($H){
			return div({"class":"projectView"},
				h2(
					"Project ",
					prj.color?{style:"color:"+prj.color}:null,
					prj.name, " (", prj.id,")"
				),
				prj.description?div(util.formatHTML(prj.description)):null,
				templates.menu(prj),
				templates.resources(prj.resources),
				templates.taskList(prj.tasks)
			);
		}},
		menu: function(prj){with($H){
			return ul({"class":"menu"},
				li({"class":"bt_AddTask"}, "Add Task"),
				li({"class":"bt_AddResource"}, "Add Resource"),
				li({"class":"bt_EditProperties"}, "Edit Properties")
			);
		}},
		taskList: function(taskList){with($H){
			if(!taskList || taskList.length==0) return;
			taskList.sort(function(t1, t2){
				return t1.date==t2.date?0:t1.date>t2.date?1:-1;
			});
			return div(
				//h4("Tasks"),
				div({"class":"taskList"},
					apply(taskList, function(task, i){
						return templates.task(task);
					})
				)
			)
		}},
		resources: function(resList){with($H){
			if(!resList) return;
			var list = [];
			for(var k in resList){
				var res = resList[k];
				list.push({priority:res.priority||0, item:res, id:k});
			}
			list.sort(function(i1, i2){
				return i1.priority==i2.priority?0:i1.priority<i2.priority?1:-1;
			});
			return div(
				div({"class":"resourceList"},
					h3("Resources"),
					apply(list, function(itm){
						return div(templates.resourceView(itm.id, itm.item));
					})
				)
			);
		}},
		resourceView: function(id, data){with($H){
			return div(
				span({style:"font-weight:bold;"}, data.name), " ",
				span({style:"color:#ccc;"}, "[",id,"]"), ": ",
				data.type=="site"?a({href:data.url, target:"_blank"}, data.url)
					:data.type=="person"?templates.personRef(data.personID)
					:data.type=="text"?a({href:"#", "class":"btSeeMore", resID:id}, "View")
					:null,
				a({href:"#", "class":"btEditRes", resID:data.id, style:"padding-left:25px;"}, "Edit")
			);
		}},
		jobList: function(jobList){with($H){
			return div(
				ul(
					apply(jobList, function(job){
						return li(
							job.date, ": ", job.hours, "h",
							job.notes?markup(" - ", job.notes):null
						);
					})
				)
			);
		}},
		personRef: function(prsID){with($H){
			var person = db.getPerson(prsID);
			return a({href:"#", "class":"lnkPerson", prsID:prsID},
				person?person.name:prsID
			);
		}},
		task: function(task){with($H){
			if(db.completedTask(task.id))
				return div(!task.parent?{"class":"task"}:null,
					div({"class":"taskNm completed"}, task.name), 
					"| ", span({"class":"menu bt_View", taskID:task.id}, "View"), " | ",
					span({"class":"completed"}, " Completed ", task.completed)
				);
				
			var qPos = db.getQueuePosition(task.id);
			var hdrCls = "taskNm"+(task.completed?" completed":"");
			return div({"class":"task"},
				div({"class":hdrCls},
					task.name, 
					task.id?span(" (", task.id,")"):null
					//   ," pos:", db.getTaskPosition(task.id)
				),
				div({"class":"properties"},
					span({style:"padding-right:5px;"}, 
						"| ", span({"class":"menu bt_View", taskID:task.id}, "View"), " | ",
						span({"class":"menu bt_Edit", taskID:task.id}, "Edit"), " |"
					),
					qPos!=null?span({"class":"queuePos"}, qPos+1, " in queue"):null,
					task.date?span({"class":"date"}, task.date):null,
					task.initiator?span(span({"class":"paramName"}, " Initiator: "), templates.personRef(task.initiator)):null,
					task.executor?span(span({"class":"paramName"}, " Executor: "), templates.personRef(task.executor)):null,
					task.completed?span({"class":"completed"}, " Completed ", task.completed):null,
					task.deadline?span({"class":"deadline "}, span({"class":"paramName"}, " Deadline: "), task.deadline):null
				),
				task.completed?null:div(
					task.description?div(task.description):null,
					task.jobs?templates.jobList(task.jobs):null
				),
				task.tasks?templates.taskList(task.tasks):null
			);
		}}
	};
	
	
	function addTask(prjID){
		taskEdit.view(prjID, $(".mainPanel"));
	}
	
	function addResource(prjID){
		resourceEdit.view(prjID, null, $(".mainPanel"));
	}
	
	function editTask(prjID, taskID){
		//console.log("Edit ", taskID, " in ", prjID);
		taskEdit.view(prjID, $(".mainPanel"), taskID);
	}

	function viewTask(prjID, taskID){
		taskView.view(taskID, $(".mainPanel"));
	}
	function viewPerson(prsID){
		personView.view($(".mainPanel"), prsID);
	}
	
	function editResource(prjID, resID){
		resourceEdit.view(prjID, resID, $(".mainPanel"));
	}
	
	function viewResource(prjID, resID){
		resourceView.view(prjID, resID, $(".mainPanel"));
	}
	
	function editProperties(prjID){
		projectPropEditor.view($(".mainPanel"), prjID);
	}
	
	return {
		view: function(id, pnl){
			pnl = pnl || $(".mainPanel");
			pnl.html(templates.main(db.getProject(id)));
			pnl.find(".bt_AddTask").click(function(){addTask(id);});
			pnl.find(".bt_AddResource").click(function(){addResource(id);});
			pnl.find(".bt_EditProperties").click(function(){editProperties(id);});
			pnl.find(".bt_View").click(function(e){viewTask(id, $(e.target).attr("taskID"));});
			pnl.find(".bt_Edit").click(function(e){editTask(id, $(e.target).attr("taskID"));});
			pnl.find(".lnkPerson").click(function(e){viewPerson($(e.target).attr("prsID"));});
			pnl.find(".btEditRes").click(function(e){editResource(id, $(e.target).attr("resID"));});
			pnl.find(".btSeeMore").click(function(e){viewResource(id, $(e.target).attr("resID"));});
		}
	};
});