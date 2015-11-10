App = React.createClass({
    render() {
        return (
            <div id="main">
                <Nav />

                <div className="container">
                    {this.props.content}
                </div>
            </div>
        );
    }
});
