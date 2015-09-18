// by bwin on 8/20/15.

'use strict';

angular.module('users').controller('RatingController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'CORE_CONST', 'Drivers', 'ionicToast',
    function($scope, $stateParams, $http, $location, Authentication, CORE_CONST, Drivers, ionicToast) {
        function errorHandler(errorResponse){
            $scope.error = errorResponse.data.message;
        }
        $scope.authentication = Authentication;
        $scope.driver = Drivers.get({
            driverId: $scope.authentication.user.driver_profile
        });
        $scope.increase = function(){
            $scope.driver.$increase_rating(function(){
                ionicToast.show('Your rating increased', 'bottom', true, 2500);
            }, errorHandler);
        };
    }
]);
