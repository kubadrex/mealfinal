'use strict';

var _ = require('lodash');
var Braintree = require('../../app/models/braintree.server.model');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleResponse (res) {
  return function (err, result) {
    if(err) {
      return handleError(res)(err);
    }
    responseWithResult(res)(result);
  };
}

exports.clientToken = function(req, res){

  Braintree.clientToken.generate({}, function (err, data) {
    return res.send(data.clientToken);
  });
};

exports.checkout = function(req, res){
  Braintree.transaction.sale({
    amount: req.body.total,
    paymentMethodNonce: req.body.nonce,
  }, function callback (err, result) {
    if(err) {
      return handleError(res)(err);
    }
    if(result.success){
      responseWithResult(res)(result);
    } else {
      handleError(res)(result.errors);
    }
  });
};
