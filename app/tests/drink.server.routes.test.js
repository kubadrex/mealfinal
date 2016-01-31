'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Drink = mongoose.model('Drink'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, drink;

/**
 * Drink routes tests
 */
describe('Drink CRUD tests', function() {
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

		// Save a user to the test db and create new Drink
		user.save(function() {
			drink = {
				name: 'Drink Name'
			};

			done();
		});
	});

	it('should be able to save Drink instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Drink
				agent.post('/drinks')
					.send(drink)
					.expect(200)
					.end(function(drinkSaveErr, drinkSaveRes) {
						// Handle Drink save error
						if (drinkSaveErr) done(drinkSaveErr);

						// Get a list of Drinks
						agent.get('/drinks')
							.end(function(drinksGetErr, drinksGetRes) {
								// Handle Drink save error
								if (drinksGetErr) done(drinksGetErr);

								// Get Drinks list
								var drinks = drinksGetRes.body;

								// Set assertions
								(drinks[0].user._id).should.equal(userId);
								(drinks[0].name).should.match('Drink Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Drink instance if not logged in', function(done) {
		agent.post('/drinks')
			.send(drink)
			.expect(401)
			.end(function(drinkSaveErr, drinkSaveRes) {
				// Call the assertion callback
				done(drinkSaveErr);
			});
	});

	it('should not be able to save Drink instance if no name is provided', function(done) {
		// Invalidate name field
		drink.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Drink
				agent.post('/drinks')
					.send(drink)
					.expect(400)
					.end(function(drinkSaveErr, drinkSaveRes) {
						// Set message assertion
						(drinkSaveRes.body.message).should.match('Please fill Drink name');
						
						// Handle Drink save error
						done(drinkSaveErr);
					});
			});
	});

	it('should be able to update Drink instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Drink
				agent.post('/drinks')
					.send(drink)
					.expect(200)
					.end(function(drinkSaveErr, drinkSaveRes) {
						// Handle Drink save error
						if (drinkSaveErr) done(drinkSaveErr);

						// Update Drink name
						drink.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Drink
						agent.put('/drinks/' + drinkSaveRes.body._id)
							.send(drink)
							.expect(200)
							.end(function(drinkUpdateErr, drinkUpdateRes) {
								// Handle Drink update error
								if (drinkUpdateErr) done(drinkUpdateErr);

								// Set assertions
								(drinkUpdateRes.body._id).should.equal(drinkSaveRes.body._id);
								(drinkUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Drinks if not signed in', function(done) {
		// Create new Drink model instance
		var drinkObj = new Drink(drink);

		// Save the Drink
		drinkObj.save(function() {
			// Request Drinks
			request(app).get('/drinks')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Drink if not signed in', function(done) {
		// Create new Drink model instance
		var drinkObj = new Drink(drink);

		// Save the Drink
		drinkObj.save(function() {
			request(app).get('/drinks/' + drinkObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', drink.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Drink instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Drink
				agent.post('/drinks')
					.send(drink)
					.expect(200)
					.end(function(drinkSaveErr, drinkSaveRes) {
						// Handle Drink save error
						if (drinkSaveErr) done(drinkSaveErr);

						// Delete existing Drink
						agent.delete('/drinks/' + drinkSaveRes.body._id)
							.send(drink)
							.expect(200)
							.end(function(drinkDeleteErr, drinkDeleteRes) {
								// Handle Drink error error
								if (drinkDeleteErr) done(drinkDeleteErr);

								// Set assertions
								(drinkDeleteRes.body._id).should.equal(drinkSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Drink instance if not signed in', function(done) {
		// Set Drink user 
		drink.user = user;

		// Create new Drink model instance
		var drinkObj = new Drink(drink);

		// Save the Drink
		drinkObj.save(function() {
			// Try deleting Drink
			request(app).delete('/drinks/' + drinkObj._id)
			.expect(401)
			.end(function(drinkDeleteErr, drinkDeleteRes) {
				// Set message assertion
				(drinkDeleteRes.body.message).should.match('User is not logged in');

				// Handle Drink error error
				done(drinkDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Drink.remove().exec();
		done();
	});
});