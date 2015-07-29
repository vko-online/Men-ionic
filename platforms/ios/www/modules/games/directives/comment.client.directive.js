// by bwin on 5/30/15.
'use strict';

angular.module('games').directive('comment', ['Games', function(Games){
   return{
       restrict: 'E',
       templateUrl: 'public/modules/games/directives/comment.client.directive.html',
       scope: {
           parent: '@',
           game: '=',
           user_id: ''
       },
       link: function(scope, elem){

       }
   };
}]);
