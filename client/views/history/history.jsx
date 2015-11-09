THistory = React.createClass({
     mixins: [ReactMeteorData],

     getMeteorData() {
     	return {
            //completedTasks: Tasks.find({userId: _user._id, type: "done"}).fetch(),
            //plannedTasks: Tasks.find({userId: _user._id, type: "planned"}).fetch()
            completedTasks: Tasks.find({type: "done"}).fetch(),
            plannedTasks: Tasks.find({type: "planned"}).fetch()
     	};
     },

    render() {
        return (
            <div className="row">
                <div className="col-md-6">
                    <div className="box box-bordered box-color">
                        <div className="box-title">
                            <h3>Tasks you completed</h3>
                        </div>
                        <div className="box-content padding">
                            <ul>
                                {this.data.completedTasks.map((task) => {
                                    return <li>{task.name}</li>;
                                })}
                            </ul>
                            <hr/>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="box box-bordered box-color">
                        <div className="box-title">
                            <h3>Tasks you planned</h3>
                        </div>
                        <div className="box-content padding">
                            <ul>
                                {this.data.plannedTasks.map((task) => {
                                    return <li>{task.name}</li>;
                                })}
                            </ul>
                            <hr/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});