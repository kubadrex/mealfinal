'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Pizza = mongoose.model('Pizza'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, pizza;

/**
 * Pizza routes tests
 */
describe('Pizza CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Pizza
		user.save(function() {
			pizza = {
				name: 'Pizza Name'
			};

			done();
		});
	});

	it('should be able to save Pizza instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pizza
				agent.post('/pizzas')
					.send(pizza)
					.expect(200)
					.end(function(pizzaSaveErr, pizzaSaveRes) {
						// Handle Pizza save error
						if (pizzaSaveErr) done(pizzaSaveErr);

						// Get a list of Pizzas
						agent.get('/pizzas')
							.end(function(pizzasGetErr, pizzasGetRes) {
								// Handle Pizza save error
								if (pizzasGetErr) done(pizzasGetErr);

								// Get Pizzas list
								var pizzas = pizzasGetRes.body;

								// Set assertions
								(pizzas[0].user._id).should.equal(userId);
								(pizzas[0].name).should.match('Pizza Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Pizza instance if not logged in', function(done) {
		agent.post('/pizzas')
			.send(pizza)
			.expect(401)
			.end(function(pizzaSaveErr, pizzaSaveRes) {
				// Call the assertion callback
				done(pizzaSaveErr);
			});
	});

	it('should not be able to save Pizza instance if no name is provided', function(done) {
		// Invalidate name field
		pizza.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pizza
				agent.post('/pizzas')
					.send(pizza)
					.expect(400)
					.end(function(pizzaSaveErr, pizzaSaveRes) {
						// Set message assertion
						(pizzaSaveRes.body.message).should.match('Please fill Pizza name');
						
						// Handle Pizza save error
						done(pizzaSaveErr);
					});
			});
	});

	it('should be able to update Pizza instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pizza
				agent.post('/pizzas')
					.send(pizza)
					.expect(200)
					.end(function(pizzaSaveErr, pizzaSaveRes) {
						// Handle Pizza save error
						if (pizzaSaveErr) done(pizzaSaveErr);

						// Update Pizza name
						pizza.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Pizza
						agent.put('/pizzas/' + pizzaSaveRes.body._id)
							.send(pizza)
							.expect(200)
							.end(function(pizzaUpdateErr, pizzaUpdateRes) {
								// Handle Pizza update error
								if (pizzaUpdateErr) done(pizzaUpdateErr);

								// Set assertions
								(pizzaUpdateRes.body._id).should.equal(pizzaSaveRes.body._id);
								(pizzaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Pizzas if not signed in', function(done) {
		// Create new Pizza model instance
		var pizzaObj = new Pizza(pizza);

		// Save the Pizza
		pizzaObj.save(function() {
			// Request Pizzas
			request(app).get('/pizzas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Pizza if not signed in', function(done) {
		// Create new Pizza model instance
		var pizzaObj = new Pizza(pizza);

		// Save the Pizza
		pizzaObj.save(function() {
			request(app).get('/pizzas/' + pizzaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', pizza.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Pizza instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pizza
				agent.post('/pizzas')
					.send(pizza)
					.expect(200)
					.end(function(pizzaSaveErr, pizzaSaveRes) {
						// Handle Pizza save error
						if (pizzaSaveErr) done(pizzaSaveErr);

						// Delete existing Pizza
						agent.delete('/pizzas/' + pizzaSaveRes.body._id)
							.send(pizza)
							.expect(200)
							.end(function(pizzaDeleteErr, pizzaDeleteRes) {
								// Handle Pizza error error
								if (pizzaDeleteErr) done(pizzaDeleteErr);

								// Set assertions
								(pizzaDeleteRes.body._id).should.equal(pizzaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Pizza instance if not signed in', function(done) {
		// Set Pizza user 
		pizza.user = user;

		// Create new Pizza model instance
		var pizzaObj = new Pizza(pizza);

		// Save the Pizza
		pizzaObj.save(function() {
			// Try deleting Pizza
			request(app).delete('/pizzas/' + pizzaObj._id)
			.expect(401)
			.end(function(pizzaDeleteErr, pizzaDeleteRes) {
				// Set message assertion
				(pizzaDeleteRes.body.message).should.match('User is not logged in');

				// Handle Pizza error error
				done(pizzaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Pizza.remove().exec();
		done();
	});
});