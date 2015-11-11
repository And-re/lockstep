Meteor.publish('tasks', () => {
    return Tasks.find({});
});