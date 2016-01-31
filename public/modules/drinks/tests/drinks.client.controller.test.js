'use strict';

(function() {
	// Drinks Controller Spec
	describe('Drinks Controller Tests', function() {
		// Initialize global variables
		var DrinksController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Drinks controller.
			DrinksController = $controller('DrinksController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Drink object fetched from XHR', inject(function(Drinks) {
			// Create sample Drink using the Drinks service
			var sampleDrink = new Drinks({
				name: 'New Drink'
			});

			// Create a sample Drinks array that includes the new Drink
			var sampleDrinks = [sampleDrink];

			// Set GET response
			$httpBackend.expectGET('drinks').respond(sampleDrinks);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.drinks).toEqualData(sampleDrinks);
		}));

		it('$scope.findOne() should create an array with one Drink object fetched from XHR using a drinkId URL parameter', inject(function(Drinks) {
			// Define a sample Drink object
			var sampleDrink = new Drinks({
				name: 'New Drink'
			});

			// Set the URL parameter
			$stateParams.drinkId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/drinks\/([0-9a-fA-F]{24})$/).respond(sampleDrink);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.drink).toEqualData(sampleDrink);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Drinks) {
			// Create a sample Drink object
			var sampleDrinkPostData = new Drinks({
				name: 'New Drink'
			});

			// Create a sample Drink response
			var sampleDrinkResponse = new Drinks({
				_id: '525cf20451979dea2c000001',
				name: 'New Drink'
			});

			// Fixture mock form input values
			scope.name = 'New Drink';

			// Set POST response
			$httpBackend.expectPOST('drinks', sampleDrinkPostData).respond(sampleDrinkResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Drink was created
			expect($location.path()).toBe('/drinks/' + sampleDrinkResponse._id);
		}));

		it('$scope.update() should update a valid Drink', inject(function(Drinks) {
			// Define a sample Drink put data
			var sampleDrinkPutData = new Drinks({
				_id: '525cf20451979dea2c000001',
				name: 'New Drink'
			});

			// Mock Drink in scope
			scope.drink = sampleDrinkPutData;

			// Set PUT response
			$httpBackend.expectPUT(/drinks\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/drinks/' + sampleDrinkPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid drinkId and remove the Drink from the scope', inject(function(Drinks) {
			// Create new Drink object
			var sampleDrink = new Drinks({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Drinks array and include the Drink
			scope.drinks = [sampleDrink];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/drinks\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDrink);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.drinks.length).toBe(0);
		}));
	});
}());