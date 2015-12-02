Focus = React.createClass({
    mixins: [ReactMeteorData],

    componentDidMount() {
        notify.config({pageVisibility: false, autoClose: 5000});

        if (notify.permissionLevel() == notify.PERMISSION_DEFAULT) {
            notify.requestPermission();
        }
    },

    getMeteorData() {
        Meteor.subscribe('teamMembers');
        Meteor.subscribe('myTeam');
        Meteor.subscribe('myTeamTasks');
        Meteor.subscribe('myTeamIsReady');

        return {
            users: Meteor.users.find({}, {sort: {createdAt: 1}}).fetch(),
            team: Teams.findOne({_id: Meteor.user().currentTeam}),
            todoTasks: Tasks.find({type: 'todo'}, {sort: {createdAt: 1}}).fetch(),
            plannedTasks: Tasks.find({type: 'planned'}, {sort: {createdAt: 1}}).fetch(),
            completedTasks: Tasks.find({type: 'completed'}, {sort: {createdAt: 1}}).fetch()
        };
    },

    toggleChecked() {
        Meteor.call('setPrivateTeam', this.data.team._id, !this.data.team.private);
    },

    removeUser(userId) {
        Meteor.call('removeUser', userId);
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
                                <div>
                                    <AddTask type="todo" team={this.data.team} />

                                    {this.data.team.phase > 0 ?
                                        <div>
                                            <hr />

                                            <AddTask type="completed" team={this.data.team}/>
                                        </div>
                                        :
                                        ''
                                    }

                                    <br />

                                    <StartButton team={this.data.team} />

                                    <hr />

                                    <h4>Todo ({this.data.todoTasks.length})</h4>
                                    <TaskList tasks={this.data.todoTasks} users={this.data.users} />

                                    <h4>Planned ({this.data.plannedTasks.length})</h4>
                                    <TaskList tasks={this.data.plannedTasks} users={this.data.users} />

                                    <h4>Completed ({this.data.completedTasks.length})</h4>
                                    <TaskList tasks={this.data.completedTasks} users={this.data.users} />
                                </div>
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
                                return (
                                    <li key={user._id} className="list-group-item cucumber-user clearfix">
                                        {user.ready ?
                                            <span><span className="glyphicon glyphicon-ok" title="Ready"></span>&nbsp;</span>
                                            :
                                            ''
                                        }
                                        {user.profile.name}
                                        <button type="button"
                                                className="btn btn-xs btn-default pull-right"
                                                onClick={this.removeUser.bind(this, user._id)}
                                                title="Remove User"
                                        >
                                            <span className="glyphicon glyphicon-remove"></span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
});