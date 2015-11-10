TasksLog = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('tasks');

        return {
            completedTasks: Tasks.find({type: 'done'}, {sort: {createdAt: 1}}).fetch(),
            plannedTasks: Tasks.find({type: 'planned'}, {sort: {createdAt: 1}}).fetch()
        };
    },

    render() {
        return (
            <div className="row">
                <div className="col-md-6">
                    <div className="panel panel-primary">
                        <div className="panel-heading">Tasks you completed ({this.data.completedTasks.length})</div>
                        <ul className="list-group">
                            {this.data.completedTasks.map((task) => {
                                return <Task key={task._id} task={task}/>;
                            })}
                        </ul>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="panel panel-primary">
                        <div className="panel-heading">Tasks you planned ({this.data.plannedTasks.length})</div>
                        <ul className="list-group">
                            {this.data.plannedTasks.map((task) => {
                                return <Task key={task._id} task={task}/>;
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
});