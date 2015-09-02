// by bwin on 8/20/15.

'use strict';

angular.module('users').controller('RatingController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'CORE_CONST', 'Drivers', 'Socket',
    function($scope, $stateParams, $http, $location, Authentication, CORE_CONST, Drivers, Socket) {
        function errorHandler(errorResponse){
            $scope.error = errorResponse.data.message;
        }
        $scope.authentication = Authentication;
        $scope.authentication.get_user().then(function(account){
            $scope.driver = Drivers.get({
                driverId: account.driver_profile
            });
        });
        $scope.increase = function(){
            $scope.driver.$increase_rating(angular.noop, errorHandler);
        };
    }
]);
