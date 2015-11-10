Meteor.startup(() => {
    if (Tasks.find().count() < 25) {
        let f = faker;
        let h = f.hacker;

        _.each(_.range(25), () => {
            let name = `${h.adjective()} ${h.noun()} ${h.ingverb()}`;
            let createdAt = f.date.past();
            let type = f.helpers.randomize(['todo', 'planned', 'done']);

            Tasks.insert({
                name,
                createdAt,
                type
            });
        });
    }
});
