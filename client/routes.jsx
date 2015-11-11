FlowRouter.route('/', {
    action: () => {
        setActiveLink();
        ReactLayout.render(App, { content: <Home /> });
    }
});

FlowRouter.route('/focus', {
    action: () => {
        setActiveLink();
        Meteor.lockstep.checkOrCreateUser(() => {
            Meteor.call('findAndJoinTeam', (error, teamId) => {
                if (checkTeamId(teamId)) {
                    FlowRouter.go(`/focus/${teamId}`);
                } else {
                    FlowRouter.go('/');
                }
            });
        });
    }
});

FlowRouter.route('/focus/:teamId', {
    action: (params) => {
        setActiveLink();
        Meteor.lockstep.checkOrCreateUser(() => {
            Meteor.call('joinTeam', params.teamId, (error, teamId) => {
                if (checkTeamId(teamId)) {
                    ReactLayout.render(App, {content: <Focus />});
                } else {
                    FlowRouter.go('/');
                }
            });
        });
    }
});

FlowRouter.route('/tasks-log', {
    action: () => {
        setActiveLink();
        ReactLayout.render(App, { content: <TasksLog /> });
    }
});

var setActiveLink = () => {
    Session.set('activeUrl', FlowRouter.current().route.path);
};

var checkTeamId = (teamId) => {
    return !(
        _.isNull(teamId) ||
        _.isUndefined(teamId) ||
        _.isEqual(teamId, 'undefined')
    );
};