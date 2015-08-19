'use strict';
angular.module('core').directive('timerWidget', [function(){
    return {
        restrict: 'EA',
        templateUrl: 'modules/core/directives/templates/timer-widget.client.directive.html',
        scope: {
            countdown: '@',
            countdownAlert: '@',
            countdownAlertClass: '@',
            execCallback: '='
        },
        link: function(scope, element, attrs){
            var
                _firstEl = $('.first'),
                _secondEl = $('.second'),
                _thirdEl = $('.third'),
                _fourthEl = $('.fourth'),
                _highlightedEls = $('.highlighted'),
                _fps = 60,
                _interval,
                _draw = function(value, total, alertValue, alertClass){
                    var angle = Math.floor((value*180)/(total/2));
                    if(angle < 180){
                        _firstEl.css('-webkit-transform', 'rotate(' + (180 + angle) + 'deg)');
                        _secondEl.css('-webkit-transform', 'rotate(' + angle + 'deg)');
                    } else {
                        angle = angle + 180;
                        _firstEl.css('-webkit-transform', 'rotate(720deg)');
                        _secondEl.css('-webkit-transform', 'rotate(540deg)');
                        _thirdEl.css('-webkit-transform', 'rotate(' + (180 + angle) + 'deg)');
                        _fourthEl.css('-webkit-transform', 'rotate(' + angle + 'deg)');
                    }
                    if(value >= alertValue){
                        _highlightedEls.addClass(alertClass);
                    }
                },
                _reset = function(alertClass){
                    _firstEl.css('-webkit-transform', '');
                    _secondEl.css('-webkit-transform', '');
                    _thirdEl.css('-webkit-transform', '');
                    _fourthEl.css('-webkit-transform', '');
                    _highlightedEls.removeClass(alertClass);
                },
                _go = function(duration, alert, alertClass){
                    var count = 0,
                        delay = Math.floor(1/_fps*1000);
                    _interval = window.setInterval(function(){
                        count = count + delay;
                        if(count >= duration){
                            window.clearInterval(_interval);
                            if(scope.execCallback)
                                scope.execCallback();
                        }
                        _draw(count, duration, alert, alertClass);
                    }, delay);
                };
            _reset(scope.countdownAlertClass);
            _go(parseInt(scope.countdown), parseInt(scope.countdownAlert), scope.countdownAlertClass);
        }
    }
}]);