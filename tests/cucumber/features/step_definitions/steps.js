var url = require('url');

module.exports = function () {

    var browsers = {};

    function getBrowserFor(person) {
        return (person === 'Both') ? browser : browsers[person];
    }

    /**
     * Definitions
     */
    this.Given(/^There (is|are) (one|two) user(s)?$/, function () {
        browsers.Alice = browser.browsers[0];
        browsers.Bob = browser.browsers[1];

        this.server.call('reset');
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

    this.When(/^([^ ]*) clicks start$/, function(person) {
        var _button = '#start-button';
        browsers[person].waitForExist(_button);
        browsers[person].click(_button);
    });

    this.Then(/^([^ ]*) should( not)? see the timer$/, function (person, boolean) {
        pending();
    });

    this.Then(/^([^ ]*) should have the timer decreasing from "([^"]*)" minutes$/, function (person, time) {
        pending();
    });
};