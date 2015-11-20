//Meteor.publish('userData', function () {
//    if (!this.userId) {
//        return this.ready();
//    }
//
//    return Meteor.users.find(
//        {_id: this.userId},
//        {fields: {currentTeam: 1}}
//    );
//});

Meteor.publish('teamMembers', function () {
    if (!this.userId) {
        return this.ready();
    }

    let _user = Meteor.users.findOne({_id: this.userId});

    return Meteor.users.find(
        {currentTeam: _user.currentTeam},
        {fields: {createdAt: 1, currentTeam: 1, 'profile.name': 1}}
    );
});