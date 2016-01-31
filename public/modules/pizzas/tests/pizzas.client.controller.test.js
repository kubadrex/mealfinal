'use strict';

(function() {
	// Pizzas Controller Spec
	describe('Pizzas Controller Tests', function() {
		// Initialize global variables
		var PizzasController,
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

			// Initialize the Pizzas controller.
			PizzasController = $controller('PizzasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Pizza object fetched from XHR', inject(function(Pizzas) {
			// Create sample Pizza using the Pizzas service
			var samplePizza = new Pizzas({
				name: 'New Pizza'
			});

			// Create a sample Pizzas array that includes the new Pizza
			var samplePizzas = [samplePizza];

			// Set GET response
			$httpBackend.expectGET('pizzas').respond(samplePizzas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pizzas).toEqualData(samplePizzas);
		}));

		it('$scope.findOne() should create an array with one Pizza object fetched from XHR using a pizzaId URL parameter', inject(function(Pizzas) {
			// Define a sample Pizza object
			var samplePizza = new Pizzas({
				name: 'New Pizza'
			});

			// Set the URL parameter
			$stateParams.pizzaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/pizzas\/([0-9a-fA-F]{24})$/).respond(samplePizza);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pizza).toEqualData(samplePizza);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Pizzas) {
			// Create a sample Pizza object
			var samplePizzaPostData = new Pizzas({
				name: 'New Pizza'
			});

			// Create a sample Pizza response
			var samplePizzaResponse = new Pizzas({
				_id: '525cf20451979dea2c000001',
				name: 'New Pizza'
			});

			// Fixture mock form input values
			scope.name = 'New Pizza';

			// Set POST response
			$httpBackend.expectPOST('pizzas', samplePizzaPostData).respond(samplePizzaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Pizza was created
			expect($location.path()).toBe('/pizzas/' + samplePizzaResponse._id);
		}));

		it('$scope.update() should update a valid Pizza', inject(function(Pizzas) {
			// Define a sample Pizza put data
			var samplePizzaPutData = new Pizzas({
				_id: '525cf20451979dea2c000001',
				name: 'New Pizza'
			});

			// Mock Pizza in scope
			scope.pizza = samplePizzaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/pizzas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/pizzas/' + samplePizzaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid pizzaId and remove the Pizza from the scope', inject(function(Pizzas) {
			// Create new Pizza object
			var samplePizza = new Pizzas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Pizzas array and include the Pizza
			scope.pizzas = [samplePizza];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/pizzas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePizza);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.pizzas.length).toBe(0);
		}));
	});
}());