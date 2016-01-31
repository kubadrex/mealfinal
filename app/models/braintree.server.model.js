'use strict';

var braintree = require('braintree');

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: 'ppfmcmxwpj7wf7kd',
  publicKey: '9psjvfm4yk7z7s72',
  privateKey: '002fa32160c24d1383be5666c540e373'
});

module.exports = gateway;
