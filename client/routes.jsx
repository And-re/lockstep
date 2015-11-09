FlowRouter.route("/", {
    action: function() {
        setActiveLink();
        ReactLayout.render(TLayout, { content: <TAnnouncement /> });
    }
});

FlowRouter.route("/history", {
    action: function() {
        setActiveLink();
        ReactLayout.render(TLayout, { content: <THistory /> });
    }
});

var setActiveLink = function() {
    Session.set("activeUrl", FlowRouter.current().route.path);
};