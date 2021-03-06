if (!Meteor.lockstep) {
    Meteor.lockstep = {};
}

let _shortRestTime = 5;
let _longRestTime = 15;
let _workTime = 25;
//let _shortRestTime = 0.05;
//let _longRestTime = 0.1;
//let _workTime = 0.15;

if (Meteor.isClient) {
    Meteor.subscribe('userData');
}

Meteor.lockstep.timer = [_workTime, _shortRestTime, _workTime, _shortRestTime, _workTime, _longRestTime];

Meteor.lockstep.formatDate = (date) => {
    return moment(date).fromNow();
};

Meteor.lockstep.checkOrCreateUser = (cb) => {
    if (_.isNull(Meteor.user())) {
        let _name = faker.name.findName();
        let _randomId = new Meteor.Collection.ObjectID()._str;
        let _randomPassword = new Meteor.Collection.ObjectID()._str;

        Accounts.createUser({
            email: `${_randomId}@lockstep.net`,
            password: _randomPassword,
            profile: {
                name: _name
            }
        }, () => {
            cb && cb();
        });
    } else {
        cb && cb();
    }
};

Meteor.lockstep.addUserToTeam = (userId, teamId) => {
    check(userId, String);
    check(teamId, String);

    if (userId && teamId) {
        Teams.update({_id: teamId}, {$addToSet: {userIds: userId}});
        Meteor.users.update({_id: userId}, {$set: {currentTeam: teamId}});
    }
};

Meteor.lockstep.createTeam = (userId) => {
    return Teams.insert({userIds: [userId], private: false, timer: Meteor.lockstep.timer, phase: 0}).toString();
};

Meteor.lockstep.getDurationString = (seconds) => {
    let _minutesLeft = Math.floor(seconds / 60);
    var _secondsLeftPadded = ('00' + seconds % 60).slice(-2);
    let _timeLeftString = `${_minutesLeft}:${_secondsLeftPadded}`;

    if (seconds < 0) {
        _timeLeftString = '0:00';
    }

    return _timeLeftString;
};

Meteor.lockstep.nextTimerPhase = (teamId, _nextPhaseShouldAutostart) => {
    let _team = Teams.findOne({_id: teamId});

    if (!_team) {
        return;
    }

    let _newPhase = (_team.phase + 1) % Meteor.lockstep.timer.length;

    if (_nextPhaseShouldAutostart) {
        Teams.update(_team._id, {
            $set: {startTime: new Date().getTime(), phase: _newPhase}
        });

        Tasks.update({teamId: _team._id, type: 'todo'}, {
            $set: {type: 'planned'}
        }, {multi: true});

        let _currentPhaseDurationMin = _team.timer[_newPhase];
        let _currentPhaseDurationMilliseconds = _currentPhaseDurationMin * 60 * 1000;

        Meteor.setTimeout(function () {
            Meteor.lockstep.nextTimerPhase(teamId, false);
        }, _currentPhaseDurationMilliseconds);
    } else {
        Teams.update(_team._id, {
            $set: {phase: _newPhase, ready: false}
        });
        Meteor.lockstep.makeTeamMembersNotReady(teamId);
    }
};

Meteor.lockstep.makeTeamMembersNotReady = (teamId) => {
    Meteor.users.update({currentTeam: teamId}, {$set: {ready: false}}, {multi: true});
};

Meteor.lockstep.isWorkPhase = (phase) => {
    return (phase % 2) === 0;
};

Meteor.lockstep.getPhaseName = (phase) => {
    return Meteor.lockstep.isWorkPhase(phase) ? 'Work' : 'Break';
};

Meteor.lockstep.getCurrentWorkPhaseName = (phase) => {
    return Meteor.lockstep.getCurrentWorkPhase(phase) / 2 + 1;
};

Meteor.lockstep.getCurrentWorkPhase = (phase) => {
    return (Math.floor(phase / 2) * 2) % 6;
};

Meteor.lockstep.setTitle = (team, secondsLeft) => {
    if (team && team.ready) {
        document.title = `${Meteor.lockstep.isWorkPhase(team.phase) ? '' : '*'}${Meteor.lockstep.getDurationString(secondsLeft)} - Lockstep`;
    } else {
        document.title = 'Lockstep';
    }
};

Meteor.lockstep.getTaskTypes = () => {
    return ['todo', 'planned', 'completed'];
};

Meteor.lockstep.isValidTaskType = (type) => {
    return _.contains(Meteor.lockstep.getTaskTypes(), type);
};

Meteor.lockstep.isStartButtonDisabled = () => {
    let _user = Meteor.user();

    let _team = Teams.findOne({_id: _user.currentTeam});

    if (!_team) {
        return true;
    }

    let _todoTasksCount = Tasks.find({userIds: _user._id, teamId: _team._id, type: 'todo', startTime: {$exists: false}}).count();
    let _completedTasksCount;

    let _lastPlannedTask = Tasks.findOne({teamId: _team._id, type: 'planned'}, {sort: {startTime: -1}});

    if (_lastPlannedTask) {
        _completedTasksCount = Tasks.find({userIds: _user._id, teamId: _team._id, type: 'completed', startTime: _lastPlannedTask.startTime}).count();
    }

    return _todoTasksCount === 0 || (!_.isUndefined(_completedTasksCount) && _completedTasksCount === 0);
};

Meteor.lockstep.startTimer = (teamId) => {
    let _team = Teams.findOne({_id: teamId, ready: {$ne: true}});

    if (!_team) {
        return;
    }

    let _readyUsersCount = Meteor.users.find(
        {currentTeam: _team._id, ready: true}
    ).count();

    if (_readyUsersCount === _team.userIds.length) {
        let startTime = new Date().getTime();

        Teams.update(_team._id, {
            $set: {ready: true, startTime: startTime}
        });

        let _currentPhase = _team.phase;
        let _totalNoOfPhases = _team.timer.length;

        if (_currentPhase >= _totalNoOfPhases) {
            _currentPhase = 0;
            Teams.update(_team._id, {
                $set: {phase: _currentPhase}
            });
        }

        Tasks.update({teamId: _team._id, startTime: {$exists: false}}, {
            $set: {phase: _currentPhase, startTime: startTime}
        }, {multi: true});

        let _currentPhaseDurationMin = _team.timer[_currentPhase];
        let _currentPhaseDurationMilliseconds = _currentPhaseDurationMin * 60 * 1000;
        let _nextPhaseShouldAutostart = Meteor.lockstep.isWorkPhase(_currentPhase);

        Meteor.setTimeout(function () {
            Meteor.lockstep.nextTimerPhase(teamId, _nextPhaseShouldAutostart);
        }, _currentPhaseDurationMilliseconds);
    }
};
