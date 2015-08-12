// by bwin on 8/7/15.

angular.module('trips').directive('pointView', [function(){
    return {
        restrict: 'E',
        templateUrl: 'modules/trips/directives/templates/point-view.client.directive.html',
        scope: {
            currentPoint: '='
        },
        link: function(scope, elem, attr){

        }
    }
}]);