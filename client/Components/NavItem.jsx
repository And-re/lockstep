NavItem = React.createClass({
    propTypes: {
        item: React.PropTypes.object.isRequired
    },

    isActive(url) {
        let parts = FlowRouter.current().path.split('/');

        return (`/${parts[1]}` === url);
    },

    render() {
        var classes = classNames({
            'active': this.isActive(this.props.item.url)
        });

        return (
            <li className={classes}>
                <a href={this.props.item.url}>{this.props.item.name}</a>
            </li>
        );
    }
});