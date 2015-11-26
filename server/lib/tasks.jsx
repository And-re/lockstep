Meteor.methods({
    addTask(task) {
        check(task, String);

        let _user = Meteor.users.findOne({_id: this.userId});

        return Tasks.insert({
            name: task,
            createdAt: new Date(),
            type: 'todo',
            userId: this.userId,
            teamId: _user.currentTeam
        });
    }
});
