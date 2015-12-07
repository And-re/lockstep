EditTask = React.createClass({
    propTypes: {
        task: React.PropTypes.object.isRequired
    },

    getInitialState() {
        return {
            name: this.props.task.name,
            isInEditMode: false
        }
    },

    toggleEditMode() {
        this.setState({isInEditMode: !this.state.isInEditMode});

        if (!this.state.isInEditMode) {
            let _nameInput = ReactDOM.findDOMNode(this.refs.name);
            _nameInput.setSelectionRange(0, _nameInput.value.length);
        }
    },

    updateName() {
        let name = this.refs.name.value;
        this.setState({name});
    },

    edit(e) {
        e.preventDefault();

        let name = this.refs.name.value;

        name = name.trim();

        if (!name) {
            alert('The name cannot be empty or with spaces only.');
            return;
        }

        Meteor.call('editTask', this.props.task._id, name);
        this.toggleEditMode();
    },

    cancel() {
        this.setState({name: this.props.task.name});
        this.toggleEditMode();
    },

    render() {
        let editNameClasses = classNames({
            'hidden': this.state.isInEditMode
        });

        let editFormClasses = classNames({
            'form-inline': true,
            'hidden': !this.state.isInEditMode
        });

        return (
            <div>
                <span className={editNameClasses} onClick={this.toggleEditMode}>{this.props.task.name}</span>
                <form className={editFormClasses} onSubmit={this.edit}>
                    <input type="text"
                           className="form-control"
                           ref="name"
                           placeholder="Task Name"
                           value={this.state.name}
                           onChange={this.updateName}
                    />
                    &nbsp;
                    <div className="btn-group btn-group-sm" role="group">
                        <button type="submit"
                                className="btn btn-primary"
                                title="Save"
                        >
                            <span className="glyphicon glyphicon-ok"></span>
                        </button>
                        <button type="button"
                                className="btn btn-default"
                                onClick={this.cancel}
                                title="Cancel"
                        >
                            <span className="glyphicon glyphicon-remove"></span>
                        </button>
                    </div>
                </form>
            </div>
        );
    }
});