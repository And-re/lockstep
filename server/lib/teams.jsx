Meteor.methods({
    findAndJoinTeam() {
        let _teamId;
        let _previousTeam;

        let _user = Meteor.user();

        if (_user.currentTeam) {
            _previousTeam = Teams.findOne({_id: _user.currentTeam});
        }

        if (_previousTeam) {
            _teamId = _previousTeam._id;
        } else {
            let _openTeam = Teams.findOne({private: false});

            if (!_openTeam) {
                _teamId = Teams.insert({userIds: [this.userId], private: false});
            } else {
                _teamId = _openTeam._id;
            }
        }
        Meteor.lockstep.addUserToTeam(this.userId, _teamId);

        return _teamId;
    },
    joinTeam(teamId) {
        check(teamId, String);

        Meteor.lockstep.addUserToTeam(this.userId, teamId);

        return teamId;
    },
    setPrivateTeam(teamId, isPrivate) {
        check(teamId, String);
        check(isPrivate, Boolean);

        Teams.update(teamId, {
            $set: {private: isPrivate}
        });
    }
});
