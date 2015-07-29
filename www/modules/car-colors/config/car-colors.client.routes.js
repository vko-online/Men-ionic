'use strict';

//Setting up route
angular.module('car-colors').config(['$stateProvider',
	function($stateProvider) {
		// Car colors state routing
		$stateProvider.
		state('listCarColors', {
			url: '/car-colors',
			templateUrl: 'modules/car-colors/views/list-car-colors.client.view.html'
		}).
		state('createCarColor', {
			url: '/car-colors/create',
			templateUrl: 'modules/car-colors/views/create-car-color.client.view.html'
		}).
		state('viewCarColor', {
			url: '/car-colors/:carColorId',
			templateUrl: 'modules/car-colors/views/view-car-color.client.view.html'
		}).
		state('editCarColor', {
			url: '/car-colors/:carColorId/edit',
			templateUrl: 'modules/car-colors/views/edit-car-color.client.view.html'
		});
	}
]);