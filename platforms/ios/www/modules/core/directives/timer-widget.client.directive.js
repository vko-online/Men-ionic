'use strict';
angular.module('core').directive('timerWidget', [function(){
    return {
        restrict: 'EA',
        templateUrl: 'modules/core/directives/templates/timer-widget.client.directive.html',
        scope: {
            countdown: '=',
            execCallback: '=',
            execPercent: '='
        },
        link: function(scope, element, attrs){

        }
    }
}]);