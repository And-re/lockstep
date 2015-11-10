FlowRouter.route('/', {
    action: function() {
        setActiveLink();
        ReactLayout.render(App, { content: <Home /> });
    }
});

FlowRouter.route('/focus', {
    action: function() {
        setActiveLink();
        Meteor.lockstep.checkOrCreateUser(() => {
            ReactLayout.render(App, {content: <Focus />});
        });
    }
});

FlowRouter.route('/tasks-log', {
    action: function() {
        setActiveLink();
        ReactLayout.render(App, { content: <TasksLog /> });
    }
});

var setActiveLink = function() {
    Session.set('activeUrl', FlowRouter.current().route.path);
};