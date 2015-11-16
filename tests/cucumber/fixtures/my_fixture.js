(function () {

  'use strict';

  Meteor.methods({
    'reset' : function() {
      Tasks.remove({});
      Teams.remove({});
      Meteor.users.remove({});
    }
  });

})();