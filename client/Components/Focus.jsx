Focus = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('teamMembers');

        return {
            users: Meteor.users.find({}, {sort: {createdAt: 1}}).fetch(),
            team: Teams.find(Meteor.user().currentTeam).fetch()
        };
    },

    toggleChecked() {
        //this.data.team.private = ! this.data.team.private;
        //this.data.team.save();
        Teams.update(this.data.team._id, {
            $set: {private: ! this.data.team.private}
        });
    },

    render() {
        return (
            <div className="row">

                <div className="col-md-6">
                    <div className="panel panel-primary">
                        <div className="panel-heading">Tasks</div>
                        <div className="panel-body">
                            Tasks
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="panel panel-primary">
                        <div className="panel-heading">Team</div>
                        <div className="panel-body">
                            <div className="checkbox">
                                <label>
                                    <input type="checkbox"
                                           readOnly={true}
                                           checked={this.data.team.private}
                                           onClick={this.toggleChecked}
                                    /> Private
                                </label>
                            </div>
                        </div>
                        <ul className="list-group">
                            {this.data.users.map((user) => {
                                return <li key={user._id} className="list-group-item">{user.profile.name}</li>;
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
});