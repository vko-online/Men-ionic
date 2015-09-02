'use strict';

(function() {
	// Car brands Controller Spec
	describe('Car brands Controller Tests', function() {
		// Initialize global variables
		var CarBrandsController,
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

			// Initialize the Car brands controller.
			CarBrandsController = $controller('CarBrandsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Car brand object fetched from XHR', inject(function(CarBrands) {
			// Create sample Car brand using the Car brands service
			var sampleCarBrand = new CarBrands({
				name: 'New Car brand'
			});

			// Create a sample Car brands array that includes the new Car brand
			var sampleCarBrands = [sampleCarBrand];

			// Set GET response
			$httpBackend.expectGET('car-brands').respond(sampleCarBrands);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.carBrands).toEqualData(sampleCarBrands);
		}));

		it('$scope.findOne() should create an array with one Car brand object fetched from XHR using a carBrandId URL parameter', inject(function(CarBrands) {
			// Define a sample Car brand object
			var sampleCarBrand = new CarBrands({
				name: 'New Car brand'
			});

			// Set the URL parameter
			$stateParams.carBrandId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/car-brands\/([0-9a-fA-F]{24})$/).respond(sampleCarBrand);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.carBrand).toEqualData(sampleCarBrand);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(CarBrands) {
			// Create a sample Car brand object
			var sampleCarBrandPostData = new CarBrands({
				name: 'New Car brand'
			});

			// Create a sample Car brand response
			var sampleCarBrandResponse = new CarBrands({
				_id: '525cf20451979dea2c000001',
				name: 'New Car brand'
			});

			// Fixture mock form input values
			scope.name = 'New Car brand';

			// Set POST response
			$httpBackend.expectPOST('car-brands', sampleCarBrandPostData).respond(sampleCarBrandResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Car brand was created
			expect($location.path()).toBe('/car-brands/' + sampleCarBrandResponse._id);
		}));

		it('$scope.update() should update a valid Car brand', inject(function(CarBrands) {
			// Define a sample Car brand put data
			var sampleCarBrandPutData = new CarBrands({
				_id: '525cf20451979dea2c000001',
				name: 'New Car brand'
			});

			// Mock Car brand in scope
			scope.carBrand = sampleCarBrandPutData;

			// Set PUT response
			$httpBackend.expectPUT(/car-brands\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/car-brands/' + sampleCarBrandPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid carBrandId and remove the Car brand from the scope', inject(function(CarBrands) {
			// Create new Car brand object
			var sampleCarBrand = new CarBrands({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Car brands array and include the Car brand
			scope.carBrands = [sampleCarBrand];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/car-brands\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCarBrand);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.carBrands.length).toBe(0);
		}));
	});
}());