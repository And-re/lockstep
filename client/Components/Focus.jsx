Focus = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        return {

        };
    },

    render() {
        return (
            <div className="row">
                <div className="col-md-6">
                    <div className="panel panel-primary">
                        <div className="panel-heading">Tasks</div>
                        <div className="panel-body">
                            Tasks
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="panel panel-primary">
                        <div className="panel-heading">Chat</div>
                        <div className="panel-body">
                            Chat
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});