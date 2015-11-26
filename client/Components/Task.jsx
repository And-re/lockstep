Task = React.createClass({
    propTypes: {
        task: React.PropTypes.object.isRequired
    },

    render() {
        return (
            <li className="list-group-item clearfix">
                <div className="pull-right small text-muted text-right">
                    {this.props.task.user ?
                        <div className="text-primary">
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