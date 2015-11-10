Task = React.createClass({
    propTypes: {
        task: React.PropTypes.object.isRequired
    },

    render() {
        return (
            <li className="list-group-item"><span className="pull-right small text-muted">{Meteor.lockstep.formatDate(this.props.task.createdAt)}</span>{this.props.task.name}</li>
        );
    }
});