var url = require('url');

module.exports = function() {

    var browsers = {
        Alice: {}
    };

    this.Given(/^I am a new user$/, function () {
        browsers.Alice = client;
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
            return Meteor.user().profile.name;
        }).value;
        var _nameContainer = 'p.navbar-text=' + _name;
        browsers[person].waitForExist(_nameContainer);
    });

    this.Then(/^([^ ]*) should see (her|his) team as public$/, function (person) {
        var _checkbox = 'input[type=checkbox]';
        browsers[person].waitForExist(_checkbox);
        expect(browsers[person].getAttribute(_checkbox, 'checked')).toBeFalsy();
    });

    this.Then(/^([^ ]*) should see (her|his) team as private/, function (person) {
        var _checkbox = 'input[type=checkbox]';
        browsers[person].waitForExist(_checkbox);
        expect(browsers[person].getAttribute(_checkbox, 'checked')).toBeTruthy();
    });

    this.When(/^([^ ]*) checks the private checkbox$/, function (person) {
        var _checkbox = 'input[type=checkbox]';
        browsers[person].waitForExist(_checkbox);
        browsers[person].click(_checkbox);
    });
};