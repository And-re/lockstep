Nav = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        return {
            user: Meteor.user()
        };
    },

    getNavItems() {
        return _.filter(Routes, (route) => {
            if (!route.auth || this.data.user) {
                return route;
            }
        });
        //return Routes;
    },

    renderNavItems() {
        return this.getNavItems().map((item) => {
            return <NavItem key={item.url} item={item} />;
        });
    },

    renderCurrentUser() {
        if (this.data.user) {
            return (
                <div className="navbar-right">
                    <EditName name={this.data.user.profile.name} />
                </div>
            );
        }
    },

    render() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button"
                                className="navbar-toggle collapsed"
                                data-toggle="collapse"
                                data-target="#navbar"
                                aria-expanded="false"
                                aria-controls="navbar"
                        >
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                    </div>
                    <div id="navbar" className="collapse navbar-collapse">
                        <ul className="nav navbar-nav">
                            {this.renderNavItems()}
                        </ul>
                        {this.renderCurrentUser()}
                    </div>
                </div>
            </nav>
        );
    }
});