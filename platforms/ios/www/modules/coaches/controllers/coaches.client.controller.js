'use strict';

// Coaches controller
angular.module('coaches').controller('CoachesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Coaches', 'SportTypes',
	function($scope, $stateParams, $location, Authentication, Coaches, SportTypes) {
		$scope.authentication = Authentication;
		$scope.sport_types = SportTypes.query();
		// Create new Coach
		$scope.create = function() {
			// Create new Coach object
			var coach = new Coaches ({
				phone: this.phone,
				bio: this.bio,
				sport_type: this.sport_type
			});

			// Redirect after save
			coach.$save(function(response) {
				$location.path('coaches/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Coach
		$scope.remove = function(coach) {
			if ( coach ) { 
				coach.$remove();

				for (var i in $scope.coaches) {
					if ($scope.coaches [i] === coach) {
						$scope.coaches.splice(i, 1);
					}
				}
			} else {
				$scope.coach.$remove(function() {
					$location.path('coaches');
				});
			}
		};

		// Update existing Coach
		$scope.update = function() {
			var coach = $scope.coach;
			coach.sport_type = coach.sport_type._id;
			coach.$update(function() {
				$location.path('coaches/' + coach._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Coaches
		$scope.find = function() {
			$scope.coaches = Coaches.query();
		};

		// Find existing Coach
		$scope.findOne = function() {
			$scope.coach = Coaches.get({ 
				coachId: $stateParams.coachId
			});
		};

		$scope.create_price_list = function(){
			$scope.coach.$create_price_list({
				price: $scope.new_price_list.price,
				note: $scope.new_price_list.note
			}, function(successResponse){
				$scope.new_price_list = {
					price: 0,
					note: ''
				};
				$scope.inline_modal = false;
			}, function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};
		$scope.new_price_list = {
			price: 0,
			note: ''
		};
		$scope.delete_price_list = function(id){
			$scope.coach.$delete_price_list({
				coachId: $stateParams.coachId,
				price_list_id: id
			});
		};
	}
]);
