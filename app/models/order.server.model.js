'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Braintree = require('../../app/models/braintree.server.model.js'),
	ValidationError = mongoose.Error.ValidationError,
	ValidatorError  = mongoose.Error.ValidatorError;


var OrderDetailsSchema = new Schema({
  id: Schema.Types.ObjectId,
  name: String,
  quantity: Number,
  total: {type: Number },
  data: {}
});

var orderStatusDefault = 'Waiting for payment';
var orderInPreparation = 'Order in preparation';

/**
 * Order Schema
 */
var OrderSchema = new Schema({
	shippingType: String,
	shippingAddress: String,
	shippingPhone: String,
	orderStatus: { type: String, default: orderStatusDefault },
	drinks: [OrderDetailsSchema],
	pizzas: [OrderDetailsSchema],
	sides: [OrderDetailsSchema],
	shipping: {type: Number, default: 0.0 },
	tax: {type: Number, default: 0.0 },
	subTotal: {type: Number },
	total: {type: Number, required: true},
  // payment info
	status: { type: String, default: 'pending' }, // pending, paid/failed, delivered, canceled, refunded.
	paymentType: { type: String, default: 'braintree' },
	paymentStatus: Schema.Types.Mixed,
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	nonce: String,
	type: String
});

// execute payment
OrderSchema.pre('validate', function (next) {
	if(!this.nonce) { next(); }

	if (this.orderStatus === orderStatusDefault) {
	  executePayment(this, function (err, result) {
	    this.paymentStatus = result;

	    if(err || !result.success){
	      this.status = 'failed. ' + result.message;

	      var error = new ValidationError(this);
	    	error.errors.order = new ValidatorError(
	    		'order',
	    		result.message,
	    		'notvalid',
	    		'foo'
	  		);
	    	return next(error);
	    } else {
	      this.status = 'paid';
		  	this.orderStatus = orderInPreparation;
	      next();
	    }
	  }.bind(this));
	} else {
		next();
	}

});

function executePayment(payment, cb){
	Braintree.transaction.sale({
    amount: payment.total/100,
    paymentMethodNonce: payment.nonce,
  }, cb);
}

mongoose.model('Order', OrderSchema);
