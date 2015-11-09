var _links = [
    //{
    //    name: "Lockstep",
    //    url: "/focus",
    //    active: false
    //},
    {
        name: "Tasks Log",
        url: "/history",
        active: false,
        logIn: true
    }
];

TLink = React.createClass({
    // mixins: [ReactMeteorData],

    // getMeteorData() {
    // 	return {
    // 		loginState: LoginState.get()
    // 	}
    // },

    render() {
        var linkItems = this.props.items.map(function (item) {
            //var renderItem = false;
            var renderItem = true; // temporary
            //if (Meteor.userId()) {
            //    if (item.logIn) {
            //        renderItem = true;
            //    } else if (!item.logOut) {
            //        renderItem = true;
            //    }
            //} else {
            //    if (!item.logIn) {
            //        renderItem = true;
            //    } else if (item.logOut) {
            //        renderItem = true;
            //    }
            //}

            item.active = "topNav";
            if (Session.equals("activeUrl", item.url)) {
                item.active = "topNav active";
            }

            if (renderItem) {
                return (
                    <li key={item.url} className={item.active}><a href={item.url}>{item.name}</a></li>
                );
            }
        });

        return (
            <ul className="nav navbar-nav main-nav hidden-xs hidden-sm">
                {linkItems}
            </ul>
        );
    }
});

THeader = React.createClass({
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
                        <TLink items={_links}/>
                    </div>
                </div>
            </nav>
        );
    }
});