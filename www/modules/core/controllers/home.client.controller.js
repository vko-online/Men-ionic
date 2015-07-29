'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$state', '$ionicHistory',
	function($scope, Authentication, $state, $ionicHistory) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$ionicHistory.clearHistory();
	}
]);