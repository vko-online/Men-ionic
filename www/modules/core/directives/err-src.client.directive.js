/*
 * mobile Copyright (c) 2015, Medet Tleukabiluly
 * Available via the MIT license. http://vko-online.mit-license.org/
 * Created at 9/18/15
 *         _                           _ _            
 *  __   _| | _____         ___  _ __ | (_)_ __   ___ 
 *  \ \ / / |/ / _ \ _____ / _ \| '_ \| | | '_ \ / _ \
 *   \ V /|   < (_) |_____| (_) | | | | | | | | |  __/
 *    \_/ |_|\_\___/       \___/|_| |_|_|_|_| |_|\___|
 *                                                  
 */

'use strict';

 angular.module('core').directive('errSrc', function(){
     return {
         link: function(scope, element, attrs){
             element.bind('error', function(){
                 if(attrs.src != attrs.errSrc){
                     attrs.$set('src', attrs.errSrc);
                 }
             });
         }
     }
 });