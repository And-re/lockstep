NavItem = React.createClass({
    propTypes: {
        item: React.PropTypes.object.isRequired
    },

    isActive() {
        return Session.equals('activeUrl', this.props.item.url);
    },

    render() {
        this.props.item.active = this.isActive();

        var classes = classNames({
            'active': this.props.item.active
        });

        return (
            <li className={classes}>
                <a href={this.props.item.url}>{this.props.item.name}</a>
            </li>
        );
    }
});