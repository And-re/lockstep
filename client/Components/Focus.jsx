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

        let _team = null;

        if (Meteor.user()) {
            _team = Teams.findOne({_id: Meteor.user().currentTeam});
        }

        let _todoTasks = [];
        let _plannedTasks = [];
        let _completedTasks = [];

        if (_team) {
            let _lastPlannedTask = Tasks.findOne({teamId: _team._id, type: 'planned'}, {sort: {startTime: -1}});

            _todoTasks = Tasks.find({type: 'todo', $or: [{startTime: {$exists: false}}, {startTime: _team.startTime}]}, {sort: {createdAt: 1}}).fetch();

            if (_lastPlannedTask && (!Meteor.lockstep.isWorkPhase(_team.phase) || !_team.ready)) {
                _plannedTasks = Tasks.find({type: 'planned', startTime: _lastPlannedTask.startTime}, {sort: {createdAt: 1}}).fetch();
                _completedTasks = Tasks.find({type: 'completed', startTime: _lastPlannedTask.startTime}, {sort: {createdAt: 1}}).fetch();
            }
        }

        return {
            users: Meteor.users.find({}, {sort: {createdAt: 1}}).fetch(),
            team: _team,
            todoTasks: _todoTasks,
            plannedTasks: _plannedTasks,
            completedTasks: _completedTasks
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

                                    <hr />

                                    <AddTask type="completed" team={this.data.team} />

                                    <br />

                                    <StartButton team={this.data.team} isDisabled={Meteor.lockstep.isStartButtonDisabled()} />

                                    <hr />

                                    <h4>Todo ({this.data.todoTasks.length})</h4>
                                    <TaskList tasks={this.data.todoTasks} users={this.data.users} showActions={true} />

                                    <h4>Planned ({this.data.plannedTasks.length})</h4>
                                    <TaskList tasks={this.data.plannedTasks} users={this.data.users} showActions={true} />

                                    <h4>Completed ({this.data.completedTasks.length})</h4>
                                    <TaskList tasks={this.data.completedTasks} users={this.data.users} showActions={true} />
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