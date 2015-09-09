'use strict';

//Trips service used to communicate Trips REST endpoints
angular.module('trips').factory('Trips', ['$resource', 'CORE_CONST',
	function($resource, CORE_CONST) {
		return $resource(CORE_CONST.REST_URL + 'trips/:tripId', { tripId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			prepare_trip: {
				method: 'POST',
				url: CORE_CONST.REST_URL + 'trips/prepare_trip'
			},
			begin_trip: {
				method: 'POST',
				url: CORE_CONST.REST_URL + 'trips/:tripId/begin_trip'
			},
			end_trip: {
				method: 'POST',
				url: CORE_CONST.REST_URL + 'trips/:tripId/end_trip'
			},
			cancel_trip: {
				method: 'POST',
				url: CORE_CONST.REST_URL + 'trips/:tripId/cancel_trip'
			},
			request_pickup: {
				method: 'POST',
				url: CORE_CONST.REST_URL + 'trips/:tripId/request_pickup'
			},
			cancel_request_pickup: {
				method: 'POST',
				url: CORE_CONST.REST_URL + 'trips/:tripId/cancel_request_pickup'
			},
			accept_pickup: {
				method: 'POST',
				url: CORE_CONST.REST_URL + 'trips/:tripId/accept_pickup/:driverRequestId'
			},
			arrived_trip: {
				method: 'POST',
				url: CORE_CONST.REST_URL + 'trips/:tripId/arrived_trip'
			},
			met_trip: {
				method: 'POST',
				url: CORE_CONST.REST_URL + 'trips/:tripId/met_trip'
			},
			driver_requests: {
				method: 'GET',
				url: CORE_CONST.REST_URL + 'trips/:tripId/driver_requests'
			},
			history: {
				method: 'GET',
				url: CORE_CONST.REST_URL + 'trips/history',
				isArray: true
			},
			by_location: {
				method: 'GET',
				url: CORE_CONST.REST_URL + 'trips/location',
				isArray: true
			},
			driver_location: {
				method: 'POST',
				url: CORE_CONST.REST_URL + 'trips/:tripId/driver_location'
			},
			remove_pickup_request: {
				method: 'POST',
				url: CORE_CONST.REST_URL + 'trips/:tripId/remove_pickup_request'
			},
			notify_client: {
				method: 'POST',
				url: CORE_CONST.REST_URL + 'trips/:tripId/notify_client'
			}
		});
	}
]);