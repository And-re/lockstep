TaskList = React.createClass({
    propTypes: {
        tasks: React.PropTypes.array.isRequired,
        users: React.PropTypes.array,
        showActions: React.PropTypes.bool
    },

    render() {
        if (this.props.users) {
            let usersById = {};

            this.props.users.forEach((user) => {
                usersById[user._id] = user.profile.name;
            });

            this.props.tasks.map((task) => {
                task.users = [];
                task.userIds && task.userIds.forEach((userId) => {
                    task.users.push(usersById[userId]);
                });
                return task;
            });
        }

        return (
            <ul className="list-group">
                {this.props.tasks.map((task) => {
                    return <Task key={task._id} task={task} showActions={this.props.showActions} />;
                })}
            </ul>
        );
    }
});