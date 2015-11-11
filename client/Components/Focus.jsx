Focus = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('teamMembers');

        return {
            users: Meteor.users.find({}, {sort: {createdAt: 1}}).fetch()
        };
    },

    render() {
        return (
            <div className="row">
                <div className="col-md-6">
                    <div className="panel panel-primary">
                        <div className="panel-heading">Tasks</div>
                        <ul className="list-group">
                            {this.data.users.map((user) => {
                                return <li key={user._id} className="list-group-item">{user.profile.name}</li>;
                            })}
                        </ul>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="panel panel-primary">
                        <div className="panel-heading">Chat</div>
                        <div className="panel-body">
                            Chat
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});