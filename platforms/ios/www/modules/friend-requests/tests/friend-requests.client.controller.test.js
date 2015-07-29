'use strict';

(function() {
	// Friend requests Controller Spec
	describe('Friend requests Controller Tests', function() {
		// Initialize global variables
		var FriendRequestsController,
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

			// Initialize the Friend requests controller.
			FriendRequestsController = $controller('FriendRequestsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Friend request object fetched from XHR', inject(function(FriendRequests) {
			// Create sample Friend request using the Friend requests service
			var sampleFriendRequest = new FriendRequests({
				name: 'New Friend request'
			});

			// Create a sample Friend requests array that includes the new Friend request
			var sampleFriendRequests = [sampleFriendRequest];

			// Set GET response
			$httpBackend.expectGET('friend-requests').respond(sampleFriendRequests);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.friendRequests).toEqualData(sampleFriendRequests);
		}));

		it('$scope.findOne() should create an array with one Friend request object fetched from XHR using a friendRequestId URL parameter', inject(function(FriendRequests) {
			// Define a sample Friend request object
			var sampleFriendRequest = new FriendRequests({
				name: 'New Friend request'
			});

			// Set the URL parameter
			$stateParams.friendRequestId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/friend-requests\/([0-9a-fA-F]{24})$/).respond(sampleFriendRequest);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.friendRequest).toEqualData(sampleFriendRequest);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(FriendRequests) {
			// Create a sample Friend request object
			var sampleFriendRequestPostData = new FriendRequests({
				name: 'New Friend request'
			});

			// Create a sample Friend request response
			var sampleFriendRequestResponse = new FriendRequests({
				_id: '525cf20451979dea2c000001',
				name: 'New Friend request'
			});

			// Fixture mock form input values
			scope.name = 'New Friend request';

			// Set POST response
			$httpBackend.expectPOST('friend-requests', sampleFriendRequestPostData).respond(sampleFriendRequestResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Friend request was created
			expect($location.path()).toBe('/friend-requests/' + sampleFriendRequestResponse._id);
		}));

		it('$scope.update() should update a valid Friend request', inject(function(FriendRequests) {
			// Define a sample Friend request put data
			var sampleFriendRequestPutData = new FriendRequests({
				_id: '525cf20451979dea2c000001',
				name: 'New Friend request'
			});

			// Mock Friend request in scope
			scope.friendRequest = sampleFriendRequestPutData;

			// Set PUT response
			$httpBackend.expectPUT(/friend-requests\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/friend-requests/' + sampleFriendRequestPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid friendRequestId and remove the Friend request from the scope', inject(function(FriendRequests) {
			// Create new Friend request object
			var sampleFriendRequest = new FriendRequests({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Friend requests array and include the Friend request
			scope.friendRequests = [sampleFriendRequest];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/friend-requests\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFriendRequest);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.friendRequests.length).toBe(0);
		}));
	});
}());