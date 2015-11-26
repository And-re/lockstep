Meteor.publish('tasks', function () {
    if (!this.userId) {
        return [];
    }

    return Tasks.find({userId: this.userId});
});

Meteor.publish('myTeamTasks', function () {
    if (!this.userId) {
        return [];
    }

    let _user = Meteor.users.findOne({_id: this.userId});

    return Tasks.find({teamId: _user.currentTeam});
});