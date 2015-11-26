(function () {

    'use strict';

    Meteor.methods({
        'reset': function () {
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

})();