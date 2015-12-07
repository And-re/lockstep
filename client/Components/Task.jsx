Task = React.createClass({
    propTypes: {
        task: React.PropTypes.object.isRequired,
        showActions: React.PropTypes.bool
    },

    actions: {
        'Todo': 'repeat',
        'Planned': 'time',
        'Completed': 'ok'
    },

    getActionButton(type) {
        let action = this[`moveTo${type}`];
        let classNames = `glyphicon glyphicon-${this.actions[type]}`;
        let title = `Move to ${type} Tasks`;

        return (
            <button type="button"
                    className="btn btn-xs btn-default"
                    onClick={action}
                    title={title}
            >
                <span className={classNames}></span>
            </button>
        );
    },

    getActionButtons() {
        return (
            <div className="pull-right small text-muted text-right">
                <div className="task-actions btn-group-vertical" role="group">
                    <button type="button"
                            className="btn btn-xs btn-default"
                            onClick={this.removeTask}
                            title="Remove"
                    >
                        <span className="glyphicon glyphicon-remove"></span>
                    </button>
                    <button type="button"
                            className="btn btn-xs btn-default"
                            onClick={this.addMeToTask}
                            title="Add Me to this Task"
                    >
                        <span className="glyphicon glyphicon-duplicate"></span>
                    </button>
                </div>
            </div>
        );
    },

    moveToTodo() {
        Meteor.call('moveTask', this.props.task._id, 'todo');
    },

    moveToPlanned() {
        Meteor.call('moveTask', this.props.task._id, 'planned');
    },

    moveToCompleted() {
        Meteor.call('moveTask', this.props.task._id, 'completed');
    },

    addMeToTask() {
        Meteor.call('addMeToTask', this.props.task._id);
    },

    removeTask() {
        Meteor.call('removeTask', this.props.task._id);
    },

    render() {
        return (
            <li className="task-item list-group-item clearfix">
                {this.props.showActions ?
                    this.getActionButtons()
                    :
                    ''
                }

                <div className="pull-right small text-muted text-right">
                    {Meteor.lockstep.formatDate(this.props.task.createdAt)}

                    {this.props.task.users && this.props.task.users.map((user) => {
                        return (
                            <div key={user} className="task-user text-primary">
                                {user}
                            </div>
                        );
                    })}
                </div>
                <EditTask task={this.props.task} />
            </li>
        );
    }
});