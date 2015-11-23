Timer = React.createClass({
    propTypes: {
        team: React.PropTypes.object.isRequired
    },

    getInitialState() {
        return {
            secondsLeft: this.props.team.timer[this.props.team.phase] * 60
        }
    },

    componentDidMount() {
        this.timer = setInterval(this.tick, 1000);
    },

    componentWillUnmount() {
        clearInterval(this.timer);
    },

    tick() {
        let _currentPhaseDuration = this.props.team.timer[this.props.team.phase] * 60; // in seconds
        let _secondsPassed = moment().diff(moment(this.props.team.startTime), 'seconds');
        let _secondsLeft = _currentPhaseDuration - _secondsPassed;

        this.setState({secondsLeft: _secondsLeft});
    },

    render() {
        let _timeLeftString = Meteor.lockstep.getDurationString(this.state.secondsLeft);

        return (
            <div id="timer">
                <h1 className="text-center"><samp>{_timeLeftString}</samp></h1>
            </div>
        );
    }
});