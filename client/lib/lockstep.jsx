if (!Meteor.lockstep) {
    Meteor.lockstep = {};
}

Meteor.lockstep.formatDate = (date) => {
    return moment(date).fromNow();
}

Meteor.lockstep.checkOrCreateUser = (cb) => {
    if (_.isNull(Meteor.user())) {
        let _name = faker.name.findName();
        let _randomId = new Meteor.Collection.ObjectID()._str;
        let _randomPassword = new Meteor.Collection.ObjectID()._str;

        Accounts.createUser({
            email: `${_randomId}@lockstep.net`,
            password: _randomPassword,
            profile: {
                username: _name
            }
        }, () => {
            cb && cb();
        });
    } else {
        cb && cb();
    }
};