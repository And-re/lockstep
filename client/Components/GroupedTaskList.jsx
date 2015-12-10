GroupedTaskList = React.createClass({
    propTypes: {
        plannedTasks: React.PropTypes.array.isRequired,
        completedTasks: React.PropTypes.array.isRequired,
        users: React.PropTypes.array,
        showActions: React.PropTypes.bool
    },

    render() {
        if (this.props.users) {
            let usersById = {};

            this.props.users.forEach((user) => {
                usersById[user._id] = user.profile.name;
            });

            this.props.plannedTasks.map((task) => {
                task.users = [];
                task.userIds && task.userIds.forEach((userId) => {
                    task.users.push(usersById[userId]);
                });
                return task;
            });

            this.props.completedTasks.map((task) => {
                task.users = [];
                task.userIds && task.userIds.forEach((userId) => {
                    task.users.push(usersById[userId]);
                });
                return task;
            });
        }

        let _taskDates = distinctPhasesStartTime(this.props.plannedTasks);
        let _groupedPlannedTasks = [];

        _taskDates.sort();

        _taskDates.forEach((_startTime) => {
            let _thisStartTimePlannedTasks = [];
            let _thisStartTimeCompletedTasks = [];

            this.props.plannedTasks.forEach((_task) => {
                if (_task.startTime === _startTime) {
                    _thisStartTimePlannedTasks.push(_task);
                }
            });

            this.props.completedTasks.forEach((_task) => {
                if (_task.startTime === _startTime) {
                    _thisStartTimeCompletedTasks.push(_task);
                }
            });

            _groupedPlannedTasks.push({
                'startTime': _startTime,
                'plannedTasks': _thisStartTimePlannedTasks,
                'completedTasks': _thisStartTimeCompletedTasks
            });
        });

        return (
            <div>
                {_groupedPlannedTasks.map((_taskList) => {
                    return <div>
                        <div>
                            <h4>Phase started
                                at: {moment(_taskList.startTime).format('dddd YYYY/MM/DD HH:mm:ss')}</h4>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="panel panel-primary">
                                        <div className="panel-heading">Planned tasks:</div>
                                        <ul className="list-group">
                                            {_taskList.plannedTasks.map((task) => {
                                                return <Task key={task._id} task={task}
                                                             showActions={this.props.showActions}/>;
                                                })}
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="panel panel-primary">
                                        <div className="panel-heading">Completed tasks:</div>
                                        <ul className="list-group">
                                            {_taskList.completedTasks.map((task) => {
                                                return <Task key={task._id} task={task}
                                                             showActions={this.props.showActions}/>;
                                                })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    })}
            </div>
        );
    }
});

function distinctPhasesStartTime(data) {
    let _dates = [];

    data.forEach((_task) => {
        _dates.push(_task.startTime);
    });

    return _.uniq(_dates);
}