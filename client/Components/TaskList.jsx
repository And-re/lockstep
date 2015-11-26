TaskList = React.createClass({
    propTypes: {
        tasks: React.PropTypes.array.isRequired,
        users: React.PropTypes.array
    },

    render() {
        if (this.props.users) {
            let usersById = {};

            this.props.users.forEach((user) => {
                usersById[user._id] = user.profile.name;
            });
            
            this.props.tasks.map((task) => {
                task.user = usersById[task.userId];
                return task;
            });
        }

        return (
            <ul className="list-group">
                {this.props.tasks.map((task) => {
                    return <Task key={task._id} task={task} />;
                })}
            </ul>
        );
    }
});