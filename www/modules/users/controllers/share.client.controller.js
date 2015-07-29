// by bwin on 7/27/15.
'use strict';

angular.module('users').controller('ShareController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'CORE_CONST',
    function($scope, $stateParams, $http, $location, Authentication, CORE_CONST) {
        $scope.authentication = Authentication;

    }
]);
