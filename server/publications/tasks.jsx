Meteor.publish('tasks', function () {
    return Tasks.find({});
});

Meteor.publish('myTasks', function () {
    if (!this.userId) {
        return [];
    }

    return Tasks.find({userIds: this.userId});
});

Meteor.publish('myTeamTasks', function () {
    if (!this.userId) {
        return [];
    }

    let _user = Meteor.users.findOne({_id: this.userId});

    return Tasks.find({teamId: _user.currentTeam}, {sort: {createdAt: -1}, limit: 100});
});