TLayout = React.createClass({
    render() {
        return (
            <div id="main">
                <THeader />

                <div className="container">
                    {this.props.content}
                </div>
            </div>
        );
    }
});
