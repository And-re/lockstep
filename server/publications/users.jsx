//Meteor.publish('userData', function () {
//    return Meteor.users.find(
//        {_id: this.userId},
//        {fields: {currentTeam: 1}}
//    );
//});

Meteor.publish('teamMembers', function () {
    let _user = Meteor.users.findOne({_id: this.userId});

    return Meteor.users.find(
        {currentTeam: _user.currentTeam},
        {fields: {createdAt: 1, currentTeam: 1, 'profile.name': 1}}
    );
});