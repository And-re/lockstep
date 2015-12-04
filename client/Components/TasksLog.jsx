TasksLog = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        let users;

        if (Meteor.user() && Meteor.user().isAdmin) {
            Meteor.subscribe('teamMembers');
            Meteor.subscribe('tasks');
            users = Meteor.users.find({}, {sort: {createdAt: 1}}).fetch();
        } else {
            Meteor.subscribe('myTasks');
        }
        
        return {
            users: users,
            plannedTasks: Tasks.find({type: 'planned'}, {sort: {createdAt: 1}}).fetch(),
            completedTasks: Tasks.find({type: 'completed'}, {sort: {createdAt: 1}}).fetch()
        };
    },

    render() {
        return (
            <div className="row">
                <div className="col-md-6">
                    <div className="panel panel-primary">
                        <div className="panel-heading">Completed Tasks ({this.data.completedTasks.length})</div>
                        <TaskList tasks={this.data.completedTasks} users={this.data.users} />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="panel panel-primary">
                        <div className="panel-heading">Planned Tasks ({this.data.plannedTasks.length})</div>
                        <TaskList tasks={this.data.plannedTasks} users={this.data.users} />
                    </div>
                </div>
            </div>
        );
    }
});