TasksLog = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('tasks');

        return {
            plannedTasks: Tasks.find({type: 'planned'}, {sort: {createdAt: 1}}).fetch(),
            completedTasks: Tasks.find({type: 'completed'}, {sort: {createdAt: 1}}).fetch()
        };
    },

    render() {
        return (
            <div className="row">
                <div className="col-md-6">
                    <div className="panel panel-primary">
                        <div className="panel-heading">Tasks you completed ({this.data.completedTasks.length})</div>
                        <TaskList tasks={this.data.completedTasks} />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="panel panel-primary">
                        <div className="panel-heading">Tasks you planned ({this.data.plannedTasks.length})</div>
                        <TaskList tasks={this.data.plannedTasks} />
                    </div>
                </div>
            </div>
        );
    }
});