Meteor.methods({
    editName(name) {
        check(name, String);

        if (!name) {
            return;
        }

        return Meteor.users.update(Meteor.userId(), {
            $set: {'profile.name': name}
        });
    }
});