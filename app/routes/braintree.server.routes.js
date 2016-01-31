'use strict';

module.exports = function(app) {
    // Root routing
    var braintree = require('../../app/controllers/braintree.server.controller');

    app.route('/braintree/client_token').get(braintree.clientToken);
    app.route('/braintree/checkout').get(braintree.checkout);
};
