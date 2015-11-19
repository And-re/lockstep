var url = require('url');

module.exports = function () {

    var browsers = {
        Alice: {}
    };

    this.Given(/^I am a new user$/, function () {
        browsers.Alice = browser.browsers[0];
        browsers.Bob = browser.browsers[1];
    });

    this.When(/^([^ ]*) goes to "([^"]*)"$/, function (person, relativePath) {

        browsers[person].url(url.resolve(process.env.ROOT_URL, relativePath));
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
};