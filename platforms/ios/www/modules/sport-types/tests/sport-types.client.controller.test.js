'use strict';

(function() {
	// Sport types Controller Spec
	describe('Sport types Controller Tests', function() {
		// Initialize global variables
		var SportTypesController,
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

			// Initialize the Sport types controller.
			SportTypesController = $controller('SportTypesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Sport type object fetched from XHR', inject(function(SportTypes) {
			// Create sample Sport type using the Sport types service
			var sampleSportType = new SportTypes({
				name: 'New Sport type'
			});

			// Create a sample Sport types array that includes the new Sport type
			var sampleSportTypes = [sampleSportType];

			// Set GET response
			$httpBackend.expectGET('sport-types').respond(sampleSportTypes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sportTypes).toEqualData(sampleSportTypes);
		}));

		it('$scope.findOne() should create an array with one Sport type object fetched from XHR using a sportTypeId URL parameter', inject(function(SportTypes) {
			// Define a sample Sport type object
			var sampleSportType = new SportTypes({
				name: 'New Sport type'
			});

			// Set the URL parameter
			$stateParams.sportTypeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/sport-types\/([0-9a-fA-F]{24})$/).respond(sampleSportType);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sportType).toEqualData(sampleSportType);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(SportTypes) {
			// Create a sample Sport type object
			var sampleSportTypePostData = new SportTypes({
				name: 'New Sport type'
			});

			// Create a sample Sport type response
			var sampleSportTypeResponse = new SportTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Sport type'
			});

			// Fixture mock form input values
			scope.name = 'New Sport type';

			// Set POST response
			$httpBackend.expectPOST('sport-types', sampleSportTypePostData).respond(sampleSportTypeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Sport type was created
			expect($location.path()).toBe('/sport-types/' + sampleSportTypeResponse._id);
		}));

		it('$scope.update() should update a valid Sport type', inject(function(SportTypes) {
			// Define a sample Sport type put data
			var sampleSportTypePutData = new SportTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Sport type'
			});

			// Mock Sport type in scope
			scope.sportType = sampleSportTypePutData;

			// Set PUT response
			$httpBackend.expectPUT(/sport-types\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/sport-types/' + sampleSportTypePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid sportTypeId and remove the Sport type from the scope', inject(function(SportTypes) {
			// Create new Sport type object
			var sampleSportType = new SportTypes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Sport types array and include the Sport type
			scope.sportTypes = [sampleSportType];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/sport-types\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSportType);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.sportTypes.length).toBe(0);
		}));
	});
}());