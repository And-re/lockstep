Task = React.createClass({
    propTypes: {
        task: React.PropTypes.object.isRequired
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
                {this.props.task.type === 'todo' ?
                    <div className="task-actions btn-group-vertical" role="group">
                        <button type="button"
                                className="btn btn-xs btn-default"
                                onClick={this.removeTask}
                                title="Remove"
                        >
                            <span className="glyphicon glyphicon-remove"></span>
                        </button>
                        {this.getActionButton('Planned')}
                    </div>
                    :
                    <div className="task-actions btn-group-vertical" role="group">
                        {this.props.task.type !== 'todo' ?
                            this.getActionButton('Todo')
                            :
                            ''
                        }
                        {this.props.task.type !== 'planned' ?
                            this.getActionButton('Planned')
                            :
                            ''
                        }
                        {this.props.task.type !== 'completed' ?
                            this.getActionButton('Completed')
                            :
                            ''
                        }
                    </div>
                }
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

    removeTask() {
        Meteor.call('removeTask', this.props.task._id);
    },

    render() {
        return (
            <li className="task-item list-group-item clearfix">
                {this.props.task.user ?
                    this.getActionButtons()
                    :
                    ''
                }

                <div className="pull-right small text-muted text-right">
                    {this.props.task.user ?
                        <div className="task-user text-primary">
                            {this.props.task.user}
                        </div>
                        :
                        ''
                    }
                    {Meteor.lockstep.formatDate(this.props.task.createdAt)}
                </div>
                {this.props.task.name}
            </li>
        );
    }
});