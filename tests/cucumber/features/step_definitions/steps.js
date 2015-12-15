var url = require('url');

module.exports = function () {

    var browsers = {};
    var timers = {};

    function getBrowserFor(person) {
        return (person === 'Both') ? browser : browsers[person];
    }

    /**
     * Definitions
     */
    this.Given(/^There (is|are) (one|two) user(s)?$/, function () {
        browsers.Alice = browser.instances[0];
        browsers.Bob = browser.instances[1];

        this.server.call('reset');
        timers.shortRestTime = 0.05;
        timers.longRestTime = 0.1;
        timers.workTime = 0.15;
        this.server.call("changeTimer", timers);
    });

    this.When(/^([^ ]*) go(?:es)? to "([^"]*)"$/, function (person, relativePath) {
        getBrowserFor(person).url(url.resolve(process.env.ROOT_URL, relativePath));
    });

    this.When(/^([^ ]*) should not be logged in$/, function (person) {
        var _logout = 'a[href="/logout"]';
        expect(browsers[person].isVisible(_logout)).toBe(false);
    });

    this.Then(/^([^ ]*) should be logged in$/, function (person) {
        var _logout = 'a[href="/logout"]';
        browsers[person].waitForExist(_logout);
        expect(browsers[person].isVisible(_logout)).toBe(true);
    });

    this.Then(/^([^ ]*) should see (her|his) name in navbar$/, function (person) {
        var _name = browsers[person].execute(function () {
            return (Meteor.user() && Meteor.user().profile.name);
        }).value;
        var _nameContainer = 'p.navbar-text=' + _name;
        browsers[person].waitForExist(_nameContainer);
    });

    this.Then(/^([^ ]*) should see the team's private field set to "([^"]*)"$/, function (person, isSelected) {
        var _checkbox = 'input[type=checkbox]';
        browsers[person].waitForExist(_checkbox);
        isSelected = (isSelected.toLowerCase() == 'true');
        expect(browsers[person].isSelected(_checkbox)).toBe(isSelected);
    });

    this.Then(/^([^ ]*) should see the team is( not)? private$/, function (person, boolean) {
        var _checkbox = 'input[type=checkbox]';
        browsers[person].waitForExist(_checkbox);
        var isSelected = !boolean;

        // only works after using waitForExist
        var _isPrivate = browsers[person].execute(function () {
            return Teams.findOne(Meteor.user().currentTeam).private;
        }).value;

        expect(browsers[person].isSelected(_checkbox)).toBe(isSelected);
        expect(_isPrivate).toBe(isSelected);
    });

    this.When(/^([^ ]*) checks the private checkbox$/, function (person) {
        var _checkbox = 'input[type=checkbox]';
        browsers[person].waitForExist(_checkbox);
        browsers[person].click(_checkbox);
    });

    this.Then(/^([^ ]*) should see (her|his|the other person) name in team panel$/, function(person, direction) {
        browsers[person].waitForExist('.cucumber-user:nth-child(2)');
        var _name = browsers[person].execute(function(direction) {
            var _userId;
            if (direction === 'the other person') {
                var _currentTeamId = Meteor.user().currentTeam;
                var _currentTeam = Teams.findOne(_currentTeamId);
                _userId = _.reject(_currentTeam.userIds, function(userId) {
                    return userId === Meteor.userId()
                })[0];
            } else {
                _userId = Meteor.userId();
            }
            return Meteor.users.findOne(_userId).profile.name;
        }, direction).value;
        var _nameContainer = '.cucumber-user=' + _name;
        browsers[person].waitForExist(_nameContainer);
    });

    this.When(/^([^ ]*) adds a "([^"]*)" task$/, function(person, taskType) {
        var _taskInput = '#' + taskType + '-task input[type=text]';
        var _taskButton = '#' + taskType + '-task [type=submit]';
        browsers[person].waitForExist(_taskInput);
        browsers[person].setValue(_taskInput, taskType);
        browsers[person].waitForExist(_taskButton);
        browsers[person].click(_taskButton);
    });

    this.When(/^([^ ]*) clicks start$/, function(person) {
        var _button = '#start-button';
        browsers[person].waitForExist(_button);
        browsers[person].click(_button);
    });

    this.Then(/^([^ ]*) should( not)? see the timer$/, function (person, boolean) {
        var _panel = '#timer-panel';
        var isVisible = !boolean;

        if (isVisible) {
            browsers[person].waitForExist(_panel);
        } else {
            browsers[person].pause(1000);
        }
        expect(browsers[person].isVisible(_panel)).toBe(isVisible);
    });

    this.Then(/^([^ ]*) should have the timer decreasing using "([^"]*)"$/, function (person, phase) {
        var _durationString = browsers[person].execute(function(seconds) {
            return Meteor.lockstep.getDurationString(seconds);
        }, timers[phase] * 60).value;

        var _timerContainer = 'samp=' + _durationString;

        browsers[person].waitForExist(_timerContainer);
    });

    this.Then(/^([^ ]*) waits for the "([^"]*)" button$/, function (person, buttonText) {
        var _button = '#start-button';
        browsers[person].waitForExist(_button + '=' + buttonText);
    });
};