EditName = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired
    },

    getInitialState() {
        return {
            name: this.props.name,
            isInEditMode: false
        }
    },

    toggleEditMode() {
        this.setState({isInEditMode: !this.state.isInEditMode});
    },

    updateName() {
        let name = this.refs.name.value;
        this.setState({name});
    },

    edit(e) {
        e.preventDefault();

        let name = this.refs.name.value;
        console.log('edit name', name);

        if (!name) {
            console.log('name return');
            return;
        }

        Meteor.call('editName', name);
        this.toggleEditMode();
    },

    cancel() {
        this.setState({name: this.props.name});
        this.toggleEditMode();
    },

    render() {
        if (this.state.isInEditMode) {
            return (
                <form className="navbar-form" onSubmit={this.edit}>
                    <input type="text"
                           className="form-control"
                           ref="name"
                           placeholder="Your Name"
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
            );
        } else {
            return (
                <p className="navbar-text text-right" onClick={this.toggleEditMode}>{this.props.name}</p>
            );
        }

    }
});