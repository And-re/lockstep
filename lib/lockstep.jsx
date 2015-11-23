if (!Meteor.lockstep) {
    Meteor.lockstep = {};
}

let _shortRestTime = 5;
let _longRestTime = 15;
let _workTime = 25;

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
    return Teams.insert({userIds: [userId], private: false, timer: Meteor.lockstep.timer, phase: 0});
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