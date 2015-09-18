// by bwin on 7/24/15.
// by bwin on 6/25/15.
'use strict';
angular.module('users').controller('TripHistoryController', ['$scope', '$location', 'Trips', 'Authentication', '$stateParams', 'GeoLocation', 'CORE_CONST', '$ionicModal', '$rootScope', 'CarBrands', 'CarModels', 'CarColors',
    function($scope, $location, Trips, Authentication, $stateParams, GeoLocation, CORE_CONST, $ionicModal, $rootScope, CarBrands, CarModels, CarColors){
        $scope.authentication = Authentication;
        $scope.find = function(){
            $scope.trips = Trips.history();
        };
        $scope.findOne = function(){
            $scope.trip = Trips.get({
                tripId: $stateParams.tripId
            });
        };
        $scope.flat_text = '';
        //todo: get rid of same calls. populate state data on load
        $scope.car_brands = CarBrands.query();
        $scope.car_models = CarModels.query();
        $scope.car_colors = CarColors.query();
        $scope.get = {
            brand: function(id){
                return $scope.car_brands.filter(function(i){
                    return i._id === id;
                })[0];
            },
            color: function(id){
                return $scope.car_colors.filter(function(i){
                    return i._id === id;
                })[0];
            },
            model: function(id){
                return $scope.car_models.filter(function(i){
                    return i._id === id;
                })[0];
            }
        };
        $scope.init_flag_modal = function(){
            $ionicModal.fromTemplateUrl('modules/trips/views/flag-modal.client.view.html', {
                scope: $scope,
                animation: 'slide-in-up',
                flag_text: $scope.flag_text
            }).then(function(modal){
                $scope.flag_modal = modal;
                $scope.flag_modal.show();
                $scope.flag_text = modal.flag_text;
                $scope.close_flag_modal = function(){
                    //todo: get rid of broadcasting, as it doesn't pass object
                    //write own service in socket.io style
                    $rootScope.$broadcast('event:create-flag', $scope.flag_text);
                    $scope.flag_modal.hide();
                };
                $scope.cancel_flag_modal = function(){
                    $scope.flag_modal.hide();
                };
            })
        };
        $scope.$on('event:create-flag', function(a){
            console.log(a, $scope.flag_text);
        });
    }
]);