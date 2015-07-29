'use strict';

(function() {
	// Game results Controller Spec
	describe('Game results Controller Tests', function() {
		// Initialize global variables
		var GameResultsController,
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

			// Initialize the Game results controller.
			GameResultsController = $controller('GameResultsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Game result object fetched from XHR', inject(function(GameResults) {
			// Create sample Game result using the Game results service
			var sampleGameResult = new GameResults({
				name: 'New Game result'
			});

			// Create a sample Game results array that includes the new Game result
			var sampleGameResults = [sampleGameResult];

			// Set GET response
			$httpBackend.expectGET('game-results').respond(sampleGameResults);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gameResults).toEqualData(sampleGameResults);
		}));

		it('$scope.findOne() should create an array with one Game result object fetched from XHR using a gameResultId URL parameter', inject(function(GameResults) {
			// Define a sample Game result object
			var sampleGameResult = new GameResults({
				name: 'New Game result'
			});

			// Set the URL parameter
			$stateParams.gameResultId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/game-results\/([0-9a-fA-F]{24})$/).respond(sampleGameResult);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gameResult).toEqualData(sampleGameResult);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(GameResults) {
			// Create a sample Game result object
			var sampleGameResultPostData = new GameResults({
				name: 'New Game result'
			});

			// Create a sample Game result response
			var sampleGameResultResponse = new GameResults({
				_id: '525cf20451979dea2c000001',
				name: 'New Game result'
			});

			// Fixture mock form input values
			scope.name = 'New Game result';

			// Set POST response
			$httpBackend.expectPOST('game-results', sampleGameResultPostData).respond(sampleGameResultResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Game result was created
			expect($location.path()).toBe('/game-results/' + sampleGameResultResponse._id);
		}));

		it('$scope.update() should update a valid Game result', inject(function(GameResults) {
			// Define a sample Game result put data
			var sampleGameResultPutData = new GameResults({
				_id: '525cf20451979dea2c000001',
				name: 'New Game result'
			});

			// Mock Game result in scope
			scope.gameResult = sampleGameResultPutData;

			// Set PUT response
			$httpBackend.expectPUT(/game-results\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/game-results/' + sampleGameResultPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid gameResultId and remove the Game result from the scope', inject(function(GameResults) {
			// Create new Game result object
			var sampleGameResult = new GameResults({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Game results array and include the Game result
			scope.gameResults = [sampleGameResult];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/game-results\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGameResult);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.gameResults.length).toBe(0);
		}));
	});
}());