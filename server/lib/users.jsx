Meteor.methods({
    editName(name) {
        check(name, String);

        if (!name) {
            return;
        }

        return Meteor.users.update(Meteor.userId(), {
            $set: {'profile.name': name}
        });
    },
    removeUser(userId) {
        check(userId, String);

        let _user = Meteor.user();

        Teams.update({_id: _user.currentTeam, userIds: userId}, {$pull: {userIds: userId}}, {multi: true});
        Teams.remove({_id: _user.currentTeam, userIds: {$size: 0}});

        Meteor.users.update({_id: userId, currentTeam: _user.currentTeam}, {
            $set: {currentTeam: null}
        });

        Meteor.call('startTimer');
    }
});