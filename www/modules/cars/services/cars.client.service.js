'use strict';

//Car models service used to communicate Car models REST endpoints
angular.module('cars').factory('Cars', ['$resource', 'CORE_CONST',
	function($resource, CORE_CONST) {
		var Car =  $resource(CORE_CONST.REST_URL + 'cars/:carId', { carId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
		Car.prototype.delete = function(cb){
			Car.remove({
				carId: this._id
			}, function(){
				if(cb){
					cb();
				}
			}, angular.noop);

		};
		Car.prototype.hello = function(){
			console.info('he');
		};
		return Car;
	}
]);