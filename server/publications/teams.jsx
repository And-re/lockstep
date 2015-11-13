//Meteor.publish('teams', () => {
//    return Teams.find({private: {$ne: true}});
//});

Meteor.publish('myTeam', function () {
    let _user = Meteor.users.findOne({_id: this.userId});

    return Teams.find({_id: _user.currentTeam});
});