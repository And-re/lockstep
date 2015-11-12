FlowRouter.route('/', {
    name: 'home',
    action() {
        ReactLayout.render(App, { content: <Home /> });
    }
});

FlowRouter.route('/focus/:teamId?', {
    name: 'focus',
    action(params) {
        Meteor.lockstep.checkOrCreateUser(() => {
            if (checkTeamId(params.teamId)) {
                Meteor.call('joinTeam', params.teamId, (error, teamId) => {
                    ReactLayout.render(App, {content: <Focus />});
                });
            } else {
                Meteor.call('findAndJoinTeam', (error, teamId) => {
                    FlowRouter.go('focus', {teamId});
                    //FlowRouter.setParams({teamId}); //alternative
                });
            }
        });
    }
});

FlowRouter.route('/tasks-log', {
    name: 'tasks-log',
    action() {
        ReactLayout.render(App, { content: <TasksLog /> });
    }
});

FlowRouter.notFound = {
    action() {
        FlowRouter.go('home');
    }
};

var checkTeamId = (teamId) => {
    return !(
        _.isNull(teamId) ||
        _.isUndefined(teamId) ||
        _.isEqual(teamId, 'undefined')
    );
};