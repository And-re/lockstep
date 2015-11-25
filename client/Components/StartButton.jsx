StartButton = React.createClass({
    propTypes: {
        team: React.PropTypes.object.isRequired
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