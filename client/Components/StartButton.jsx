StartButton = React.createClass({
    propTypes: {
        team: React.PropTypes.object.isRequired
    },

    componentWillUpdate(nextProps) {
        if (nextProps.team.phase !== this.props.team.phase) {
            if (notify.permissionLevel() == notify.PERMISSION_GRANTED) {
                if (nextProps.team.ready) {
                    notify.createNotification('Break!', {
                        body: 'Time for a break!',
                        icon: '/break.png'
                    });
                } else {
                    notify.createNotification('End of Break!', {
                        body: 'Time to work!',
                        icon: '/work.png'
                    });
                }
            }
        }
    },

    startTimer() {
        Meteor.call('startTimer');
    },

    isUserReady() {
        return Meteor.user().ready;
    },

    render() {
        var classes = classNames({
            'disabled': this.isUserReady() || this.props.team.ready,
            'btn btn-success btn-block': true
        });

        return (
            <button id="start-button" className={classes}
                    onClick={this.startTimer}
            >
                {this.props.team.ready ?
                    `${Meteor.lockstep.getPhaseName(this.props.team.phase)} started`
                    :
                    this.isUserReady() ? 'Waiting...' : `Start Work Phase ${Meteor.lockstep.getCurrentWorkPhase(this.props.team.phase)}`
                }
            </button>
        );
    }
});