Home = React.createClass({
    loginAsGuest() {
        FlowRouter.go('focus');
    },

    loginWithGoogle() {
        FlowRouter.go('login-google');
    },

    render() {
        return (
            <div>
                <h3 className="text-center">Welcome to <span className="text-uppercase">Lockstep</span></h3>

                {!Meteor.user() ?
                    <div className="text-center">
                        <p>
                            <button className="btn btn-success" onClick={this.loginAsGuest}>Login As Guest</button>
                        </p>
                        <p>
                            <button className="btn btn-default" onClick={this.loginWithGoogle}>
                                <img src="/google.png" alt="Google" />&nbsp;
                                Login With Google
                            </button>
                        </p>
                    </div>
                    :
                    ''
                }
            </div>
        );
    }
});