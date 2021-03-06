Meteor.publish('userData', function () {
    if (!this.userId) {
        return this.ready();
    }

    return Meteor.users.find(
        {_id: this.userId},
        {fields: {currentTeam: 1, ready: 1, isAdmin: 1}}
    );
});

Meteor.publish('teamMembers', function () {
    if (!this.userId) {
        return this.ready();
    }

    let _user = Meteor.users.findOne({_id: this.userId});

    return Meteor.users.find(
        {currentTeam: _user.currentTeam},
        {fields: {createdAt: 1, currentTeam: 1, 'profile.name': 1, ready: 1}}
    );
});

Meteor.publish('allUsers', function () {
    return Meteor.users.find(
        {},
        {fields: {createdAt: 1, currentTeam: 1, 'profile.name': 1, ready: 1}}
    );
});

Meteor.publish('myTeamIsReady', function () {
    if (!this.userId) {
        return this.ready();
    }

    let _user = Meteor.users.findOne({_id: this.userId});

    Meteor.users.find(
        {currentTeam: _user.currentTeam},
        {fields: {createdAt: 1, currentTeam: 1, ready: 1}}
    ).observe({
        removed: () => {
            Meteor.lockstep.startTimer(_user.currentTeam);
        },
        changed: () => {
            Meteor.lockstep.startTimer(_user.currentTeam);
        }
    });
});