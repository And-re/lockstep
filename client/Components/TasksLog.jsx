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

        let _tasks = Tasks.find({type: {$in: ['planned', 'completed']}}, {sort: {createdAt: 1}}).fetch();
        let taskDates = distinctDates(_tasks);

        return {
            users: users,
            taskDates: taskDates,
            plannedTasks: Tasks.find({type: 'planned'}, {sort: {createdAt: 1}}).fetch(),
            completedTasks: Tasks.find({type: 'completed'}, {sort: {createdAt: 1}}).fetch()
        };
    },

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <ul className="pagination pagination-sm">
                        {this.data.taskDates.map((date) => {
                            return (
                                <li key={date}>
                                    <a href="#">{date}</a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
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

function distinctDates(data) {
    let dates = [];

    data.forEach((doc) => {
        dates.push(moment(doc.createdAt).format('YYYY/MM/DD'));
    });

    return _.uniq(dates);
}