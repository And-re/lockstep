Focus = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('teamMembers');
        Meteor.subscribe('myTeam');

        return {
            users: Meteor.users.find({}, {sort: {createdAt: 1}}).fetch(),
            team: Teams.findOne({_id: Meteor.user().currentTeam})
        };
    },

    toggleChecked() {
        Meteor.call('setPrivateTeam', this.data.team._id, !this.data.team.private);
    },

    render() {
        var timerClasses = classNames({
            'timer-break': this.data.team && !Meteor.lockstep.isWorkPhase(this.data.team.phase),
            'panel-body': true
        });

        return (
            <div className="row">
                <div className="col-md-6">
                    {this.data.team && this.data.team.ready ?
                        <div id="timer-panel" className="panel panel-primary">
                            <div className="panel-heading">Timer ({Meteor.lockstep.getPhaseName(this.data.team.phase)})</div>
                            <div className={timerClasses}>
                                <Timer team={this.data.team} />
                            </div>
                        </div>
                        :
                        ''
                    }
                    <div className="panel panel-primary">
                        <div className="panel-heading">Tasks</div>
                        <div className="panel-body">
                            {this.data.team ?
                                <StartButton team={this.data.team} />
                            : ''
                            }
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div id="team-panel" className="panel panel-primary">
                        <div className="panel-heading">Team</div>
                        <div className="panel-body">
                            <div className="checkbox">
                                <label>
                                    {this.data.team ?
                                        <input type="checkbox"
                                               readOnly={true}
                                               checked={this.data.team.private}
                                               onClick={this.toggleChecked}
                                        />
                                        : ''
                                    } Private
                                </label>
                            </div>
                        </div>
                        <ul className="list-group">
                            {this.data.users.map((user) => {
                                return <li key={user._id} className="list-group-item cucumber-user">{user.profile.name}</li>;
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
});