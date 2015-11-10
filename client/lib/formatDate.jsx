if (!Meteor.lockstep) {
    Meteor.lockstep = {};
}

Meteor.lockstep.formatDate = (date) => {
    return moment(date).fromNow();
}