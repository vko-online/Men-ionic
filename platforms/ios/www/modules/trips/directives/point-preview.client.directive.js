// by bwin on 8/7/15.
angular.module('trips').directive('pointPreview', ['Authentication',function(Authentication){
    return {
        restrict: 'E',
        templateUrl: 'modules/trips/directives/templates/point-preview.client.directive.html',
        scope: {
            currentTrip: '=',
            allMarkers: '=',
            currentTripIndex: '=',
            indexerCallback: '=',
            hideCallback: '='
        },
        link: function(scope, elem, attr){
            scope.visible = true;
            scope.authentication = Authentication;
            scope.prev = function(){
                var max = scope.allMarkers.length;
                if(scope.currentTripIndex === 0)
                    scope.currentTripIndex = (max - 1);
                else
                    scope.currentTripIndex -= 1;
                scope.indexerCallback(scope.currentTripIndex);
            };
            scope.next = function(){
                var max = scope.allMarkers.length;
                if(scope.currentTripIndex === (max - 1))
                    scope.currentTripIndex = 0;
                else
                    scope.currentTripIndex += 1;
                scope.indexerCallback(scope.currentTripIndex);
            };
            scope.time_in_minutes = function(time){
                if(time)
                    return Math.floor((+new Date() - (+new Date(time)))/60000) + ' min ago';
            };
        }
    }
}]);