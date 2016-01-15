TasksLog = React.createClass({
    mixins: [ReactMeteorData],

    getInitialState() {
        let _selectedDate = false;
        let _lastTask = Tasks.findOne({type: {$in: ['planned', 'completed']}}, {sort: {createdAt: -1}});
        if (_lastTask) {
            _selectedDate = moment(_lastTask.startTime).format('YYYY/MM/DD');
        }
        return {
            selectedDate: _selectedDate
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

    filterDate(date) {
        this.setState({
            selectedDate: (this.state.selectedDate === date) ? false : date
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
                                <li className={dateClasses(this, date)} key={date} onClick={this.filterDate.bind(this, date)}>
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

    return _.uniq(dates).sort();
}