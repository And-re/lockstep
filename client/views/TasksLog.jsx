TasksLog = React.createClass({
     mixins: [ReactMeteorData],

     getMeteorData() {
     	return {
            completedTasks: Tasks.find({type: "done"}).fetch(),
            plannedTasks: Tasks.find({type: "planned"}).fetch()
     	};
     },

    render() {
        return (
            <div className="row">
                <div className="col-md-6">
                    <h3>Tasks you completed</h3>
                    <ul>
                        {this.data.completedTasks.map((task) => {
                            return <Task key={task._id} task={task} />;
                        })}
                    </ul>
                </div>
                <div className="col-md-6">
                    <h3>Tasks you planned</h3>
                    <ul>
                        {this.data.plannedTasks.map((task) => {
                            return <Task key={task._id} task={task} />;
                        })}
                    </ul>
                </div>
            </div>
        );
    }
});