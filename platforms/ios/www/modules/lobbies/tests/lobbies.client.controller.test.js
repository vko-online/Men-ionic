'use strict';

(function() {
	// Lobbies Controller Spec
	describe('Lobbies Controller Tests', function() {
		// Initialize global variables
		var LobbiesController,
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

			// Initialize the Lobbies controller.
			LobbiesController = $controller('LobbiesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Lobby object fetched from XHR', inject(function(Lobbies) {
			// Create sample Lobby using the Lobbies service
			var sampleLobby = new Lobbies({
				name: 'New Lobby'
			});

			// Create a sample Lobbies array that includes the new Lobby
			var sampleLobbies = [sampleLobby];

			// Set GET response
			$httpBackend.expectGET('lobbies').respond(sampleLobbies);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.lobbies).toEqualData(sampleLobbies);
		}));

		it('$scope.findOne() should create an array with one Lobby object fetched from XHR using a lobbyId URL parameter', inject(function(Lobbies) {
			// Define a sample Lobby object
			var sampleLobby = new Lobbies({
				name: 'New Lobby'
			});

			// Set the URL parameter
			$stateParams.lobbyId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/lobbies\/([0-9a-fA-F]{24})$/).respond(sampleLobby);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.lobby).toEqualData(sampleLobby);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Lobbies) {
			// Create a sample Lobby object
			var sampleLobbyPostData = new Lobbies({
				name: 'New Lobby'
			});

			// Create a sample Lobby response
			var sampleLobbyResponse = new Lobbies({
				_id: '525cf20451979dea2c000001',
				name: 'New Lobby'
			});

			// Fixture mock form input values
			scope.name = 'New Lobby';

			// Set POST response
			$httpBackend.expectPOST('lobbies', sampleLobbyPostData).respond(sampleLobbyResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Lobby was created
			expect($location.path()).toBe('/lobbies/' + sampleLobbyResponse._id);
		}));

		it('$scope.update() should update a valid Lobby', inject(function(Lobbies) {
			// Define a sample Lobby put data
			var sampleLobbyPutData = new Lobbies({
				_id: '525cf20451979dea2c000001',
				name: 'New Lobby'
			});

			// Mock Lobby in scope
			scope.lobby = sampleLobbyPutData;

			// Set PUT response
			$httpBackend.expectPUT(/lobbies\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/lobbies/' + sampleLobbyPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid lobbyId and remove the Lobby from the scope', inject(function(Lobbies) {
			// Create new Lobby object
			var sampleLobby = new Lobbies({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Lobbies array and include the Lobby
			scope.lobbies = [sampleLobby];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/lobbies\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLobby);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.lobbies.length).toBe(0);
		}));
	});
}());