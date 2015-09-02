// by bwin on 7/31/15.
'use strict';
angular.module('trips').directive('tripStatus', ['$compile', 'template_resolve', function($compile, template_resolve){
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            trip: '=',
            statistic: '=',
            timeout: '=',
            pointcenter: '=',
            pointmarkers: '=',
            defaults: '=',

            isCurrentDriverRequest: '=',
            requestPickup: '&',
            cancelRequestPickup: '&',
            cbGet: '&',
            countdownHandler: '&'
        },
        link: function(scope, element, attrs){
            template_resolve(attrs.role, attrs.status).then(function(response){
                element.html(response.data).show();
                $compile(element.contents())(scope);
            });
        }
    }
}]);