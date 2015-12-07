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

    addTask(e) {
        e.preventDefault();

        let name = this.state.task.trim();

        if (!name) {
            alert('The task cannot be empty or with spaces only.');
            return;
        }

        Meteor.call('addTask', name, this.props.type);
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
            <form id="add-task" onSubmit={this.addTask} className="row">
                <div className="col-sm-8">
                    <input type="text"
                           className="form-control"
                           ref="task"
                           placeholder={placeholder}
                           value={this.state.task}
                           onChange={this.updateTask}
                    />
                </div>
                <div className="col-sm-4">
                    <button type="submit" className={classes}>Add Task</button>
                </div>
            </form>
        );
    }
});