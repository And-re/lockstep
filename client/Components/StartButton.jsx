StartButton = React.createClass({
    propTypes: {
        team: React.PropTypes.object.isRequired,
        isDisabled: React.PropTypes.bool
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
        if (this.isDisabled()) {
            return false;
        }
        Meteor.call('startTimer');
    },

    isUserReady() {
        return Meteor.user().ready;
    },

    isDisabled() {
        return !!this.props.isDisabled || this.isUserReady() || this.props.team.ready;
    },

    render() {
        var classes = classNames({
            'disabled': this.isDisabled(),
            'btn btn-success btn-block': true
        });

        return (
            <button id="start-button" className={classes}
                    onClick={this.startTimer}
            >
                {this.props.team.ready ?
                    `${Meteor.lockstep.getPhaseName(this.props.team.phase)} started`
                    :
                    this.isUserReady() ? 'Waiting...'
                        :
                        this.props.isDisabled ?
                        'Add some Task first'
                        :
                        `Start Work Phase ${Meteor.lockstep.getCurrentWorkPhase(this.props.team.phase)}`
                }
            </button>
        );
    }
});