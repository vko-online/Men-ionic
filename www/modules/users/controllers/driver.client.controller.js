// by bwin on 6/25/15.
'use strict';
angular.module('users').controller('DriverController', ['$scope', '$location', 'Drivers', 'Authentication', '$stateParams', 'CarBrands', 'CarModels', 'CarColors',
    function($scope, $location, Drivers, Authentication, $stateParams, CarBrands, CarModels, CarColors){
        $scope.car_brands = CarBrands.query();
        $scope.car_models = CarModels.query();
        $scope.car_colors = CarColors.query();
        $scope.authentication = Authentication;
        $scope.findOne = function(){
            if($scope.authentication && $scope.authentication.user && $scope.authentication.user.driver_profile){
                $scope.driver = Drivers.get({
                    driverId: $scope.authentication.user.driver_profile
                });
            }
        };
        if($scope.authentication && $scope.authentication.user && $scope.authentication.user.driver_profile){
            $scope.findOne();
        } else {
            $scope.driver = Authentication.user;
        }

        // If user is not signed in then redirect back home
        if(!$scope.driver) $location.path('/');
        $scope.create_driver = function(){
            Drivers.create_driver(function(successResponse){
                $location.path('/profiles/' + $scope.authentication.user._id + '/create_driver');
            }, function(errorResponse){
                $scope.error = errorResponse.message;
            });
        };
        $scope.update_car = function(){
            var driver = $scope.driver;
            driver.$update(function() {
                console.log('updated');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);
