Routes = [
    {
        url: '/',
        title: 'Lockstep',
        name: 'home',
        action() {
            ReactLayout.render(App, { content: <Home /> });
        }
    },
    {
        url: '/focus/:teamId?',
        path: '/focus',
        title: 'Focus',
        name: 'focus',
        action(params) {
            Meteor.lockstep.checkOrCreateUser(() => {
                if (checkTeamId(params.teamId)) {
                    Meteor.call('joinTeam', params.teamId, (error, teamId) => {
                        ReactLayout.render(App, {content: <Focus />});
                    });
                } else {
                    Meteor.call('findAndJoinTeam', (error, teamId) => {
                        //FlowRouter.go('focus', {teamId});
                        FlowRouter.setParams({teamId}); //alternative
                    });
                }
            });
        }
    },
    {
        url: '/tasks-log',
        title: 'Tasks Log',
        name: 'tasks-log',
        auth: true,
        action() {
            ReactLayout.render(App, { content: <TasksLog /> });
        }
    },
    {
        url: '/logout',
        title: 'Logout',
        name: 'logout',
        auth: true,
        action() {
            Meteor.logout(() => {
                FlowRouter.go('home');
            });
        }
    }
];

_.each(Routes, (route) => {
    FlowRouter.route(route.url, {
        name: route.name,
        action: route.action
    });
});


/**
 * Google Account
 */
FlowRouter.route('/login/google', {
    name: 'login-google',
    action() {
        Meteor.loginWithGoogle({}, function (err) {
            if (err) {
                Session.set('errorMessage', err.reason || 'Unknown error');
            }
            FlowRouter.go('focus');
        });
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