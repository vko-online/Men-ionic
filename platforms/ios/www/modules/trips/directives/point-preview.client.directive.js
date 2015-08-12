// by bwin on 8/7/15.

angular.module('trips').directive('pointPreview', [function(){
    return {
        restrict: 'E',
        templateUrl: 'modules/trips/directives/templates/point-preview.client.directive.html',
        scope: {
            currentPoint: '=',
            currentTrip: '=',
            active: '=',
            allPoints: '='
        },
        link: function(scope, elem, attr){
            scope.prev = function(){

            };
            scope.next = function(){

            };
        }
    }
}]);