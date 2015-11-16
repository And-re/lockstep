(function () {

    'use strict';

    module.exports = function () {

        this.Before(function () {
            console.log('Before hook');

            this.server.call('reset');
        });

    };

})();
