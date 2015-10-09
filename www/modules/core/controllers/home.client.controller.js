'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$state', '$ionicHistory', '$ionicModal',
	function($scope, Authentication, $state, $ionicHistory, $ionicModal) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.popup_sign_in = function(){
			$ionicModal.fromTemplateUrl('modules/users/views/authentication/signin.client.view.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal) {
				modal.show();
				$scope.$on('event:auth-login_hide', function(){
					modal.hide();
				});
			});
		};
	}
]);