// by bwin on 8/12/15.

'use strict';
angular.module('core').directive('loadWidget', [function(){
    return {
        restrict: 'A',
        template: '<div>loading</div>',
        scope: {
            complete: '='
        },
        link: function(scope, element, attrs){

        }
    }
}]);