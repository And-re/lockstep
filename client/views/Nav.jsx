Nav = React.createClass({
    getNavItems() {
        return [
            {
                name: "Tasks Log",
                url: "/tasks-log",
                active: false,
                logIn: true
            }
        ];
    },

    renderNavItems() {
        return this.getNavItems().map((item) => {
            return <NavItem key={item.url} item={item} />;
        });
    },

    render() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="/">Lockstep</a>
                    </div>
                    <div id="navbar" className="collapse navbar-collapse">
                        <ul className="nav navbar-nav">
                            {this.renderNavItems()}
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
});