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
            teamId: _user.currentTeam,
            userIds: [this.userId]
        });
    },
    cloneTask(taskId) {
        check(taskId, String);

        let _task = Tasks.findOne({_id: taskId});

        if (!_task || !this.userId || _.contains(_task.userIds, this.userId)) {
            return false;
        }

        return Tasks.update(taskId, {
            $addToSet: {userIds: this.userId}
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
