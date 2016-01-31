'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Side = mongoose.model('Side'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, side;

/**
 * Side routes tests
 */
describe('Side CRUD tests', function() {
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

		// Save a user to the test db and create new Side
		user.save(function() {
			side = {
				name: 'Side Name'
			};

			done();
		});
	});

	it('should be able to save Side instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Side
				agent.post('/sides')
					.send(side)
					.expect(200)
					.end(function(sideSaveErr, sideSaveRes) {
						// Handle Side save error
						if (sideSaveErr) done(sideSaveErr);

						// Get a list of Sides
						agent.get('/sides')
							.end(function(sidesGetErr, sidesGetRes) {
								// Handle Side save error
								if (sidesGetErr) done(sidesGetErr);

								// Get Sides list
								var sides = sidesGetRes.body;

								// Set assertions
								(sides[0].user._id).should.equal(userId);
								(sides[0].name).should.match('Side Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Side instance if not logged in', function(done) {
		agent.post('/sides')
			.send(side)
			.expect(401)
			.end(function(sideSaveErr, sideSaveRes) {
				// Call the assertion callback
				done(sideSaveErr);
			});
	});

	it('should not be able to save Side instance if no name is provided', function(done) {
		// Invalidate name field
		side.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Side
				agent.post('/sides')
					.send(side)
					.expect(400)
					.end(function(sideSaveErr, sideSaveRes) {
						// Set message assertion
						(sideSaveRes.body.message).should.match('Please fill Side name');
						
						// Handle Side save error
						done(sideSaveErr);
					});
			});
	});

	it('should be able to update Side instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Side
				agent.post('/sides')
					.send(side)
					.expect(200)
					.end(function(sideSaveErr, sideSaveRes) {
						// Handle Side save error
						if (sideSaveErr) done(sideSaveErr);

						// Update Side name
						side.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Side
						agent.put('/sides/' + sideSaveRes.body._id)
							.send(side)
							.expect(200)
							.end(function(sideUpdateErr, sideUpdateRes) {
								// Handle Side update error
								if (sideUpdateErr) done(sideUpdateErr);

								// Set assertions
								(sideUpdateRes.body._id).should.equal(sideSaveRes.body._id);
								(sideUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Sides if not signed in', function(done) {
		// Create new Side model instance
		var sideObj = new Side(side);

		// Save the Side
		sideObj.save(function() {
			// Request Sides
			request(app).get('/sides')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Side if not signed in', function(done) {
		// Create new Side model instance
		var sideObj = new Side(side);

		// Save the Side
		sideObj.save(function() {
			request(app).get('/sides/' + sideObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', side.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Side instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Side
				agent.post('/sides')
					.send(side)
					.expect(200)
					.end(function(sideSaveErr, sideSaveRes) {
						// Handle Side save error
						if (sideSaveErr) done(sideSaveErr);

						// Delete existing Side
						agent.delete('/sides/' + sideSaveRes.body._id)
							.send(side)
							.expect(200)
							.end(function(sideDeleteErr, sideDeleteRes) {
								// Handle Side error error
								if (sideDeleteErr) done(sideDeleteErr);

								// Set assertions
								(sideDeleteRes.body._id).should.equal(sideSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Side instance if not signed in', function(done) {
		// Set Side user 
		side.user = user;

		// Create new Side model instance
		var sideObj = new Side(side);

		// Save the Side
		sideObj.save(function() {
			// Try deleting Side
			request(app).delete('/sides/' + sideObj._id)
			.expect(401)
			.end(function(sideDeleteErr, sideDeleteRes) {
				// Set message assertion
				(sideDeleteRes.body.message).should.match('User is not logged in');

				// Handle Side error error
				done(sideDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Side.remove().exec();
		done();
	});
});