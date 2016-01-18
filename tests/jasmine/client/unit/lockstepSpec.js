describe('Meteor.lockstep', function() {
    it('formats a date from a month ago', function() {
        expect(Meteor.lockstep.formatDate(moment().subtract(1, 'months'))).toEqual('a month ago');
    });
    it('formats a date from a day ago', function() {
        expect(Meteor.lockstep.formatDate(moment().subtract(1, 'days'))).toEqual('a day ago');
    });

    it('checks if a phase is a work phase', function() {
        expect(Meteor.lockstep.isWorkPhase(0)).toEqual(true);
        expect(Meteor.lockstep.isWorkPhase(2)).toEqual(true);
        expect(Meteor.lockstep.isWorkPhase(4)).toEqual(true);

        expect(Meteor.lockstep.isWorkPhase(1)).toEqual(false);
        expect(Meteor.lockstep.isWorkPhase(3)).toEqual(false);
        expect(Meteor.lockstep.isWorkPhase(5)).toEqual(false);
    });

    it('gets a phase name', function() {
        expect(Meteor.lockstep.getPhaseName(0)).toEqual('Work');
        expect(Meteor.lockstep.getPhaseName(2)).toEqual('Work');
        expect(Meteor.lockstep.getPhaseName(4)).toEqual('Work');

        expect(Meteor.lockstep.getPhaseName(1)).toEqual('Break');
        expect(Meteor.lockstep.getPhaseName(3)).toEqual('Break');
        expect(Meteor.lockstep.getPhaseName(5)).toEqual('Break');
    });

    it('gets a current work phase name', function() {
        expect(Meteor.lockstep.getCurrentWorkPhaseName(0)).toEqual(1);
        expect(Meteor.lockstep.getCurrentWorkPhaseName(2)).toEqual(2);
        expect(Meteor.lockstep.getCurrentWorkPhaseName(4)).toEqual(3);

        expect(Meteor.lockstep.getCurrentWorkPhaseName(1)).toEqual(1);
        expect(Meteor.lockstep.getCurrentWorkPhaseName(3)).toEqual(2);
        expect(Meteor.lockstep.getCurrentWorkPhaseName(5)).toEqual(3);
    });

    it('gets a current work phase number', function() {
        expect(Meteor.lockstep.getCurrentWorkPhase(0)).toEqual(0);
        expect(Meteor.lockstep.getCurrentWorkPhase(2)).toEqual(2);
        expect(Meteor.lockstep.getCurrentWorkPhase(4)).toEqual(4);

        expect(Meteor.lockstep.getCurrentWorkPhase(1)).toEqual(0);
        expect(Meteor.lockstep.getCurrentWorkPhase(3)).toEqual(2);
        expect(Meteor.lockstep.getCurrentWorkPhase(5)).toEqual(4);
    });

    it('checks if a task has a valid type', function() {
        var tests = [
            {task: 'todo', valid: true},
            {task: 'planned', valid: true},
            {task: 'completed', valid: true},
            {task: 'wrong', valid: false}
        ];

        _.each(tests, function(test) {
            expect(Meteor.lockstep.isValidTaskType(test.task)).toEqual(test.valid);
        });
    });
});
