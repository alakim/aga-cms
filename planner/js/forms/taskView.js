define(["html", "dataSource"], function($H, ds){
	function template(data){with($H){
		return div(table(
			tr(th("ID"), td(data.id)),
			tr(th("Name"), td(data.name)),
			data.initiator?tr(th("Initiator"), td(ds.getPerson(data.initiator).name)):null,
			data.jobs && data.jobs.length?(
				tr(th("Jobs"), td(
					apply(data.jobs, function(job, i){
						return div(
							job.date, ": ", job.hours, "h"
						);
					})
				))
			):null,
			data.completed?tr(th("Completed"), td(data.completed)):null
		));
	}}
	
	return {
		view: function(id, pnl){
			pnl.html(template(ds.getTask(id)));
			pnl.find("th").attr({align:"right"});
		}
	};
});