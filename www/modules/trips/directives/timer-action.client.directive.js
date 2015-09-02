// by bwin on 8/28/15.

'use strict';

angular.module('trips').directive('timerAction', function($interval){
   return {
       restrict: 'EA',
       scope: {
           currentTime: '=',
           requestTime: '=',
           callback: '='
       },
       template: '<span>{{time}}</span>',
       link: function(scope, elem, attr){
           var callback_executed = false;
           var interval;
           if(scope.requestTime && !interval && !callback_executed){
               interval = $interval(function(){
                   scope.time = (window.moment(new Date(scope.requestTime)).unix() - window.moment(scope.currentTime).unix()) + 1;
               }, 1000);
           }
           scope.$watch('time', function(a){
               if(a < 1){
                   $interval.cancel(interval);
                   if(scope.callback){
                       callback_executed = true;
                       scope.callback();
                   }
               }
           });
       }
   };
});