Meteor.methods({
    'reset': function () {
        console.log('reset PINGWIN', Meteor);
        Tasks.remove({});
        Teams.remove({});
        Meteor.users.remove({});
    },
    'changeTimer': function (timers) {
        Meteor.lockstep.timer = [
            timers.workTime, timers.shortRestTime,
            timers.workTime, timers.shortRestTime,
            timers.workTime, timers.longRestTime
        ];
    }
});