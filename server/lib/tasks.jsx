Meteor.methods({
    addTask(task, type) {
        check(task, String);
        check(type, String);

        if (!Meteor.lockstep.isValidTaskType(type)) {
            return false;
        }

        let _user = Meteor.users.findOne({_id: this.userId});

        return Tasks.insert({
            name: task,
            createdAt: new Date(),
            type: type,
            userId: this.userId,
            teamId: _user.currentTeam
        });
    },
    moveTask(taskId, type) {
        check(taskId, String);
        check(type, String);

        if (!Meteor.lockstep.isValidTaskType(type)) {
            return false;
        }

        return Tasks.update(taskId, {
            $set: {type}
        });
    },
    removeTask(taskId) {
        check(taskId, String);

        return Tasks.remove(taskId);
    }
});
