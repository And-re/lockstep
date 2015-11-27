AddTask = React.createClass({
    propTypes: {
        team: React.PropTypes.object.isRequired,
        type: React.PropTypes.string.isRequired
    },

    getInitialState() {
        return {
            task: ''
        }
    },

    addTask() {
        Meteor.call('addTask', this.state.task, this.props.type);
        this.setState(this.getInitialState());
    },

    updateTask() {
        let task = this.refs.task.value;
        this.setState({task});
    },

    render() {
        var classes = classNames({
            'disabled': !this.state.task,
            'btn btn-primary btn-block': true
        });

        let placeholder = `Add ${this.props.type} task description`;

        return (
            <div id="add-task" className="row">
                <div className="col-sm-8">
                    <input className="form-control"
                           type="text"
                           ref="task"
                           placeholder={placeholder}
                           value={this.state.task}
                           onChange={this.updateTask}
                    />
                </div>
                <div className="col-sm-4">
                    <button className={classes} onClick={this.addTask}>Add Task</button>
                </div>
            </div>
        );
    }
});