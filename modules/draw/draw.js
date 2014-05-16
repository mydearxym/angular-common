(function() {

    'use strict';

    angular.module('common.draw', [])

        .directive("draw", ['$timeout', function($timeout){
            return {
                scope: {
                    ngChange: '&',
                    ngModel: '=',
                    strokeColor: '=?',
                    strokeWidth: '=?'
                },
                link: function(scope, element){
                    scope.strokeWidth = scope.strokeWidth || 3;
                    scope.strokeColor = scope.strokeColor || '#343536';

                    var canvas = element[0];
                    var ctx = canvas.getContext('2d')

                    // variable that decides if something should be drawn on mousemove
                    var drawing = false;

                    // the last coordinates before the current move
                    var lastX;
                    var lastY;

                    element.bind('mousedown', function(event){
                        lastX = event.offsetX || event.pageX - angular.element(element).offset().left;
                        lastY = event.offsetY || event.pageY - angular.element(element).offset().top;

                        // begins new line
                        ctx.beginPath();

                        drawing = true;
                    });

                    element.bind('mouseup', function(event){
                        // stop drawing
                        drawing = false;
                        exportImage();
                    });

                    element.bind('mousemove', function(event){
                        if (!drawing) {
                            return;
                        }

                        var offsetX = event.offsetX || event.pageX - angular.element(element).offset().left;
                        var offsetY = event.offsetY || event.pageY - angular.element(element).offset().top;

                        draw(lastX, lastY, offsetX, offsetY);

                        // set current coordinates to last one
                        lastX = offsetX;
                        lastY = offsetY;
                    });

                    scope.$watch('ngModel', function(newVal, oldVal) {
                        if (!newVal && !oldVal) {
                            return;
                        }

                        if (!newVal && oldVal) {
                            reset();
                        }
                    });

                    // canvas reset
                    function reset(){
                        element[0].width = element[0].width;
                    }

                    function draw(lX, lY, cX, cY) {
                        // line from
                        ctx.moveTo(lX,lY);

                        // to
                        ctx.lineTo(cX,cY);

                        ctx.lineCap = 'round';

                        // stroke width
                        ctx.lineWidth = scope.strokeWidth;

                        // color
                        ctx.strokeStyle = scope.strokeColor;

                        // draw it
                        ctx.stroke();
                    }

                    function exportImage() {
                        $timeout(function() {
                            scope.ngModel = canvas.toDataURL();
                            scope.ngChange();
                        });
                    }
                }
            };
        }]);

})();
