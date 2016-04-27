UserStatus.events.on('connectionLogout', function (fields) {
    Teams.update({userIds: fields.userId}, {$pull: {userIds: fields.userId}}, {multi: true});
    Teams.remove({userIds: {$size: 0}});
    let _user = Meteor.users.findOne({_id: fields.userId});

    Meteor.users.update({_id: fields.userId}, {$set: {currentTeam: null, ready: false, lastTeamId: _user.currentTeamId}});
});

UserStatus.events.on('connectionLogin', function(fields) {
    let _user = Meteor.users.findOne({_id: fields.userId});
    if (_user.lastTeamId) {
        Meteor.users.update({_id: _user._id}, {$set: {currentTeam: _user.lastTeamId}});
        Teams.update({_id: _user.lastTeamId}, {$addToSet: {userIds: fields.userId}});
    }
});