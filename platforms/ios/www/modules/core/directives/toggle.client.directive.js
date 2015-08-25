// by bwin on 8/3/15.

angular.module('core').directive('toggle', function(){
   return {
       scope: {
           model: '=',
           text: '@',
           width: '@',
           icon: '@'
       },
       template: '<button class="button taxi-btn button-positive" data-ng-click="click($event)"><i data-ng-if="icon" class="{{icon}}"></i> {{text}}</button>',
       link: function(scope, elem){
           scope.model = scope.model || false;
           if(scope.model){
             elem.addClass('activated');
           }
           elem.css('width', (scope.width - 1) + '%');
           scope.click = function(e){
               e.preventDefault();
               scope.model = !scope.model;
               console.log(scope.model);
               if(scope.model){
                   elem.addClass('activated');
               } else {
                   elem.removeClass('activated');
               }
           };
       }
   }
});