UserStatus.events.on('connectionLogout', function (fields) {
    Teams.update({userIds: fields.userId}, {$pull: {userIds: fields.userId}}, {multi: true});
    Teams.remove({userIds: {$size: 0}});

    Meteor.users.update({_id: fields.userId}, {$set: {ready: false}});
});