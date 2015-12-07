Meteor.methods({
    addTask(task, type) {
        check(task, String);
        check(type, String);

        if (!Meteor.lockstep.isValidTaskType(type)) {
            return false;
        }

        let _user = Meteor.users.findOne({_id: this.userId});

        let _team = Teams.findOne({_id: _user.currentTeam});

        if (!_team) {
            return false;
        }

        let _newTask = {
            name: task,
            createdAt: new Date(),
            type: type,
            teamId: _user.currentTeam,
            userIds: [this.userId]
        };

        if (_team.ready) {
            _newTask.startTime = _team.startTime;
            _newTask.phase = Math.floor(_team.phase / 2) * 2;
        } else if (type === 'completed') {
            let _lastPlannedTask = Tasks.findOne({teamId: _team._id, type: 'planned'}, {sort: {startTime: -1}});

            if (_lastPlannedTask) {
                _newTask.startTime = _lastPlannedTask.startTime;
                _newTask.phase = _lastPlannedTask.phase;
            }
        }

        return Tasks.insert(_newTask);
    },
    editTask(taskId, name) {
        check(taskId, String);
        check(name, String);

        name = name.trim();

        if (!name) {
            return;
        }

        return Tasks.update(taskId, {
            $set: {'name': name}
        });
    },
    addMeToTask(taskId) {
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
