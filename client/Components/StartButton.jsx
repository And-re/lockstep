StartButton = React.createClass({
    startTimer() {
        Meteor.call('startTimer');
    },

    isUserReady() {
        return Meteor.user().ready;
    },

    render() {
        var classes = classNames({
            'disabled': this.isUserReady(),
            'btn btn-success btn-block': true
        });

        return (
            <button className={classes}
                    onClick={this.startTimer}
            >
                {this.isUserReady() ? 'Waiting...' : 'Start'}
            </button>
        );
    }
});