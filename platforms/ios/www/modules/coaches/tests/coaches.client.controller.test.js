'use strict';

(function() {
	// Coaches Controller Spec
	describe('Coaches Controller Tests', function() {
		// Initialize global variables
		var CoachesController,
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

			// Initialize the Coaches controller.
			CoachesController = $controller('CoachesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Coach object fetched from XHR', inject(function(Coaches) {
			// Create sample Coach using the Coaches service
			var sampleCoach = new Coaches({
				name: 'New Coach'
			});

			// Create a sample Coaches array that includes the new Coach
			var sampleCoaches = [sampleCoach];

			// Set GET response
			$httpBackend.expectGET('coaches').respond(sampleCoaches);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.coaches).toEqualData(sampleCoaches);
		}));

		it('$scope.findOne() should create an array with one Coach object fetched from XHR using a coachId URL parameter', inject(function(Coaches) {
			// Define a sample Coach object
			var sampleCoach = new Coaches({
				name: 'New Coach'
			});

			// Set the URL parameter
			$stateParams.coachId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/coaches\/([0-9a-fA-F]{24})$/).respond(sampleCoach);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.coach).toEqualData(sampleCoach);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Coaches) {
			// Create a sample Coach object
			var sampleCoachPostData = new Coaches({
				name: 'New Coach'
			});

			// Create a sample Coach response
			var sampleCoachResponse = new Coaches({
				_id: '525cf20451979dea2c000001',
				name: 'New Coach'
			});

			// Fixture mock form input values
			scope.name = 'New Coach';

			// Set POST response
			$httpBackend.expectPOST('coaches', sampleCoachPostData).respond(sampleCoachResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Coach was created
			expect($location.path()).toBe('/coaches/' + sampleCoachResponse._id);
		}));

		it('$scope.update() should update a valid Coach', inject(function(Coaches) {
			// Define a sample Coach put data
			var sampleCoachPutData = new Coaches({
				_id: '525cf20451979dea2c000001',
				name: 'New Coach'
			});

			// Mock Coach in scope
			scope.coach = sampleCoachPutData;

			// Set PUT response
			$httpBackend.expectPUT(/coaches\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/coaches/' + sampleCoachPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid coachId and remove the Coach from the scope', inject(function(Coaches) {
			// Create new Coach object
			var sampleCoach = new Coaches({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Coaches array and include the Coach
			scope.coaches = [sampleCoach];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/coaches\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCoach);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.coaches.length).toBe(0);
		}));
	});
}());