TasksLog = React.createClass({
    mixins: [ReactMeteorData],

    getInitialState() {
        return {
            selectedDate: false
        }
    },

    getMeteorData() {
        let users;

        if (Meteor.user() && Meteor.user().isAdmin) {
            Meteor.subscribe('allUsers');
            Meteor.subscribe('tasks');
            users = Meteor.users.find({}, {sort: {createdAt: 1}}).fetch();
        } else {
            Meteor.subscribe('myTasks');
        }

        let _tasks = Tasks.find({type: {$in: ['planned', 'completed']}}, {sort: {createdAt: 1}}).fetch();
        let taskDates = distinctDates(_tasks);

        let _query = {};

        if (this.state.selectedDate) {
            let _clickedDateMidnight1 = moment(this.state.selectedDate, 'YYYY/MM/DD').startOf('day').valueOf();
            let _clickedDateMidnight2 = moment(this.state.selectedDate, 'YYYY/MM/DD').endOf('day').valueOf();

            _query = {
                "startTime": {
                    "$gte": _clickedDateMidnight1,
                    "$lt": _clickedDateMidnight2
                }
            }
        }

        return {
            users: users,
            taskDates: taskDates,
            plannedTasks: Tasks.find(_.extend({type: 'planned'}, _query), {sort: {createdAt: 1}}).fetch(),
            completedTasks: Tasks.find(_.extend({type: 'completed'}, _query), {sort: {createdAt: 1}}).fetch()
        };
    },

    filterDate(event) {
        let _selectedDate = event.target.innerText;

        this.setState({
            selectedDate: (this.state.selectedDate === _selectedDate) ? false : _selectedDate
        });
    },

    render() {
        let dateClasses = function (that, date) {
            return classNames({
                'active': that.state.selectedDate === date
            })
        };

        return (
            <div className="row">
                <div className="col-md-12">
                    <ul className="pagination pagination-sm">
                        {this.data.taskDates.map((date) => {
                            return (
                            <li className={dateClasses(this, date)} key={date} onClick={this.filterDate}>
                                <a href="#">{date}</a>
                            </li>
                                );
                            })}
                    </ul>
                </div>
                <div className="col-md-12">
                    <GroupedTaskList plannedTasks={this.data.plannedTasks} completedTasks={this.data.completedTasks}
                                     users={this.data.users} />
                </div>
            </div>
        );
    }
});

function distinctDates(data) {
    let dates = [];

    data.forEach((doc) => {
        dates.push(moment(doc.startTime).format('YYYY/MM/DD'));
    });

    return _.uniq(dates);
}