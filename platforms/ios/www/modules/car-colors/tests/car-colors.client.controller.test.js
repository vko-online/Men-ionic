'use strict';

(function() {
	// Car colors Controller Spec
	describe('Car colors Controller Tests', function() {
		// Initialize global variables
		var CarColorsController,
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

			// Initialize the Car colors controller.
			CarColorsController = $controller('CarColorsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Car color object fetched from XHR', inject(function(CarColors) {
			// Create sample Car color using the Car colors service
			var sampleCarColor = new CarColors({
				name: 'New Car color'
			});

			// Create a sample Car colors array that includes the new Car color
			var sampleCarColors = [sampleCarColor];

			// Set GET response
			$httpBackend.expectGET('car-colors').respond(sampleCarColors);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.carColors).toEqualData(sampleCarColors);
		}));

		it('$scope.findOne() should create an array with one Car color object fetched from XHR using a carColorId URL parameter', inject(function(CarColors) {
			// Define a sample Car color object
			var sampleCarColor = new CarColors({
				name: 'New Car color'
			});

			// Set the URL parameter
			$stateParams.carColorId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/car-colors\/([0-9a-fA-F]{24})$/).respond(sampleCarColor);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.carColor).toEqualData(sampleCarColor);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(CarColors) {
			// Create a sample Car color object
			var sampleCarColorPostData = new CarColors({
				name: 'New Car color'
			});

			// Create a sample Car color response
			var sampleCarColorResponse = new CarColors({
				_id: '525cf20451979dea2c000001',
				name: 'New Car color'
			});

			// Fixture mock form input values
			scope.name = 'New Car color';

			// Set POST response
			$httpBackend.expectPOST('car-colors', sampleCarColorPostData).respond(sampleCarColorResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Car color was created
			expect($location.path()).toBe('/car-colors/' + sampleCarColorResponse._id);
		}));

		it('$scope.update() should update a valid Car color', inject(function(CarColors) {
			// Define a sample Car color put data
			var sampleCarColorPutData = new CarColors({
				_id: '525cf20451979dea2c000001',
				name: 'New Car color'
			});

			// Mock Car color in scope
			scope.carColor = sampleCarColorPutData;

			// Set PUT response
			$httpBackend.expectPUT(/car-colors\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/car-colors/' + sampleCarColorPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid carColorId and remove the Car color from the scope', inject(function(CarColors) {
			// Create new Car color object
			var sampleCarColor = new CarColors({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Car colors array and include the Car color
			scope.carColors = [sampleCarColor];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/car-colors\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCarColor);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.carColors.length).toBe(0);
		}));
	});
}());