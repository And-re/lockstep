if (!Meteor.lockstep) {
    Meteor.lockstep = {};
}

let _shortRestTime = 0.1;
let _longRestTime = 0.2;
let _workTime = 0.3;

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
    let _team = Teams.insert({userIds: [userId], private: false, timer: Meteor.lockstep.timer, phase: 0}).toString();

    return _team;
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

    let _newPhase = _team.phase + 1;

    if (_nextPhaseShouldAutostart) {
        Teams.update(_team._id, {
            $set: {startTime: new Date().getTime(), phase: _newPhase}
        });
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

Meteor.lockstep.getCurrentWorkPhase = (phase) => {
    return ((phase / 2) % 3) + 1;
};

Meteor.lockstep.setTitle = (team, secondsLeft) => {
    if (team && team.ready) {
        document.title = `${Meteor.lockstep.isWorkPhase(team.phase) ? '' : '*'}${Meteor.lockstep.getDurationString(secondsLeft)} - Lockstep`;
    } else {
        document.title = 'Lockstep';
    }
};

