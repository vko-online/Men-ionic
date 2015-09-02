// by bwin on 6/25/15.
'use strict';
angular.module('users').controller('DriverController', ['$scope', '$location', 'CORE_CONST', 'Drivers', 'Authentication', '$stateParams', 'CarBrands', 'CarModels', 'CarColors', 'FileUploader',
    function($scope, $location, CORE_CONST, Drivers, Authentication, $stateParams, CarBrands, CarModels, CarColors, FileUploader){
        $scope.car_brands = CarBrands.query();
        $scope.car_models = CarModels.query();
        $scope.car_colors = CarColors.query();
        $scope.authentication = Authentication;
        //todo: refactor this hell
        $scope.findOne = function(){
            if($scope.authentication.user.driver_profile){
                $scope.driver = Drivers.get({
                    driverId: $scope.authentication.user.driver_profile
                });
            }
        };

        //if($scope.authentication && $scope.authentication.user && $scope.authentication.user.driver_profile){
        //    $scope.findOne();
        //} else {
        //    $scope.driver = Authentication.user;
        //}

        // If user is not signed in then redirect back home
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
        var uploader = $scope.uploader = new FileUploader({
            url: CORE_CONST.REST_URL + 'upload'
        });

        // FILTERS

        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            if($scope.driver)
                $scope.driver.photo_src = response;
        };
        $scope.CORE_CONST = CORE_CONST;
    }
]);
