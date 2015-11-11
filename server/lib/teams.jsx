Meteor.methods({
    findAndJoinTeam: function() {
        console.log('findAndJoinTeam', this.userId);

        var _teamId;
        var _previousTeam;

        var _user = Meteor.user();

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
    joinTeam: function(teamId) {
        check(teamId, String);

        Meteor.lockstep.addUserToTeam(this.userId, teamId);

        return teamId;
    }
});
