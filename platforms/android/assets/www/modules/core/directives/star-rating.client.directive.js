// by bwin on 8/20/15.

'use strict';
angular.module('core').directive('starRating', function(){
    return {
        restrict: 'AE',
        replace: true,
        template: '<div class="text-center ionic_ratings">' +
        '<span class="icon {{iconOff}} ionic_rating_icon_off" ng-style="_iconOffColor" ng-click="ratingsClicked(1)" ng-show="rating < 1" ng-class="{\'read_only\':(readonly)}"></span>' +
        '<span class="icon {{iconOn}} ionic_rating_icon_on" ng-style="_iconOnColor" ng-click="ratingsUnClicked(1)" ng-show="rating > 0" ng-class="{\'read_only\':(readonly)}"></span>' +
        '<span class="icon {{iconOff}} ionic_rating_icon_off" ng-style="_iconOffColor" ng-click="ratingsClicked(2)" ng-show="rating < 2" ng-class="{\'read_only\':(readonly)}"></span>' +
        '<span class="icon {{iconOn}} ionic_rating_icon_on" ng-style="_iconOnColor" ng-click="ratingsUnClicked(2)" ng-show="rating > 1" ng-class="{\'read_only\':(readonly)}"></span>' +
        '<span class="icon {{iconOff}} ionic_rating_icon_off" ng-style="_iconOffColor" ng-click="ratingsClicked(3)" ng-show="rating < 3" ng-class="{\'read_only\':(readonly)}"></span>' +
        '<span class="icon {{iconOn}} ionic_rating_icon_on" ng-style="_iconOnColor" ng-click="ratingsUnClicked(3)" ng-show="rating > 2" ng-class="{\'read_only\':(readonly)}"></span>' +
        '<span class="icon {{iconOff}} ionic_rating_icon_off" ng-style="_iconOffColor" ng-click="ratingsClicked(4)" ng-show="rating < 4" ng-class="{\'read_only\':(readonly)}"></span>' +
        '<span class="icon {{iconOn}} ionic_rating_icon_on" ng-style="_iconOnColor" ng-click="ratingsUnClicked(4)" ng-show="rating > 3" ng-class="{\'read_only\':(readonly)}"></span>' +
        '<span class="icon {{iconOff}} ionic_rating_icon_off" ng-style="_iconOffColor" ng-click="ratingsClicked(5)" ng-show="rating < 5" ng-class="{\'read_only\':(readonly)}"></span>' +
        '<span class="icon {{iconOn}} ionic_rating_icon_on" ng-style="_iconOnColor" ng-click="ratingsUnClicked(5)" ng-show="rating > 4" ng-class="{\'read_only\':(readonly)}"></span>' +
        '</div>',
        scope: {
            rating: '=',
            iconOn: '=?',
            iconOff: '=?',
            iconOnColor: '=?',
            iconOffColor: '=?',
            minRating: '=?',
            readonly: '=?',
            callback: '=?'
        },
        link: function(scope, element, attrs) {

            //Setting the default values, if they are not passed
            scope.iconOn = scope.iconOn || 'ion-ios-star';
            scope.iconOff = scope.iconOff || 'ion-ios-star-outline';
            scope.iconOnColor = scope.iconOnColor || 'rgb(200, 200, 100)';
            scope.iconOffColor = scope.iconOffColor || 'rgb(200, 100, 100)';
            scope.rating = scope.rating || 1;
            scope.minRating = scope.minRating || 1;
            scope.readonly = scope.readonly || false;
            scope.callback = scope.callback || angular.noop;

            //Setting the color for the icon, when it is active
            scope._iconOnColor = {
                color: scope.iconOnColor
            };

            //Setting the color for the icon, when it is not active
            scope._iconOffColor = {
                color: scope.iconOffColor
            };

            //Setting the rating
            scope.rating = (scope.rating > scope.minRating) ? scope.rating : scope.minRating;

            //Setting the previously selected rating
            scope.prevRating = 0;

            //Called when he user clicks on the rating
            scope.ratingsClicked = function(val) {
                if (scope.minRating !== 0 && val < scope.minRating) {
                    scope.rating = scope.minRating;
                } else {
                    scope.rating = val;
                }
                scope.prevRating = val;
                scope.callback(scope.rating);
            };

            //Called when he user un clicks on the rating
            scope.ratingsUnClicked = function(val) {
                if (scope.minRating !== 0 && val < scope.minRating) {
                    scope.rating = scope.minRating;
                } else {
                    scope.rating = val;
                }
                if (scope.prevRating == val) {
                    if (scope.minRating !== 0) {
                        scope.rating = scope.minRating;
                    } else {
                        scope.rating = 0;
                    }
                }
                scope.prevRating = val;
                scope.callback(scope.rating);
            };
        }
    }
});