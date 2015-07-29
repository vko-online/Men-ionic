'use strict';

//Setting up route
angular.module('car-brands').config(['$stateProvider',
	function($stateProvider) {
		// Car brands state routing
		$stateProvider.
		state('listCarBrands', {
			url: '/car-brands',
			templateUrl: 'modules/car-brands/views/list-car-brands.client.view.html'
		}).
		state('createCarBrand', {
			url: '/car-brands/create',
			templateUrl: 'modules/car-brands/views/create-car-brand.client.view.html'
		}).
		state('viewCarBrand', {
			url: '/car-brands/:carBrandId',
			templateUrl: 'modules/car-brands/views/view-car-brand.client.view.html'
		}).
		state('editCarBrand', {
			url: '/car-brands/:carBrandId/edit',
			templateUrl: 'modules/car-brands/views/edit-car-brand.client.view.html'
		});
	}
]);