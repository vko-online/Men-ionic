'use strict';

(function() {
	// Game requests Controller Spec
	describe('Game requests Controller Tests', function() {
		// Initialize global variables
		var GameRequestsController,
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

			// Initialize the Game requests controller.
			GameRequestsController = $controller('GameRequestsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Game request object fetched from XHR', inject(function(GameRequests) {
			// Create sample Game request using the Game requests service
			var sampleGameRequest = new GameRequests({
				name: 'New Game request'
			});

			// Create a sample Game requests array that includes the new Game request
			var sampleGameRequests = [sampleGameRequest];

			// Set GET response
			$httpBackend.expectGET('game-requests').respond(sampleGameRequests);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gameRequests).toEqualData(sampleGameRequests);
		}));

		it('$scope.findOne() should create an array with one Game request object fetched from XHR using a gameRequestId URL parameter', inject(function(GameRequests) {
			// Define a sample Game request object
			var sampleGameRequest = new GameRequests({
				name: 'New Game request'
			});

			// Set the URL parameter
			$stateParams.gameRequestId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/game-requests\/([0-9a-fA-F]{24})$/).respond(sampleGameRequest);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gameRequest).toEqualData(sampleGameRequest);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(GameRequests) {
			// Create a sample Game request object
			var sampleGameRequestPostData = new GameRequests({
				name: 'New Game request'
			});

			// Create a sample Game request response
			var sampleGameRequestResponse = new GameRequests({
				_id: '525cf20451979dea2c000001',
				name: 'New Game request'
			});

			// Fixture mock form input values
			scope.name = 'New Game request';

			// Set POST response
			$httpBackend.expectPOST('game-requests', sampleGameRequestPostData).respond(sampleGameRequestResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Game request was created
			expect($location.path()).toBe('/game-requests/' + sampleGameRequestResponse._id);
		}));

		it('$scope.update() should update a valid Game request', inject(function(GameRequests) {
			// Define a sample Game request put data
			var sampleGameRequestPutData = new GameRequests({
				_id: '525cf20451979dea2c000001',
				name: 'New Game request'
			});

			// Mock Game request in scope
			scope.gameRequest = sampleGameRequestPutData;

			// Set PUT response
			$httpBackend.expectPUT(/game-requests\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/game-requests/' + sampleGameRequestPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid gameRequestId and remove the Game request from the scope', inject(function(GameRequests) {
			// Create new Game request object
			var sampleGameRequest = new GameRequests({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Game requests array and include the Game request
			scope.gameRequests = [sampleGameRequest];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/game-requests\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGameRequest);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.gameRequests.length).toBe(0);
		}));
	});
}());