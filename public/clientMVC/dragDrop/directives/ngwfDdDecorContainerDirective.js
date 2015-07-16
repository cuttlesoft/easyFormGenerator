/**
 * 
 * ddDecorContainer directive :
 *
 * WHAT IS IT USED FOR? : 
 *
 * - apply configuration to containers (or lines in layoutor group controls in control selection)
 *   - apply title (ONLY if group controls (left drop zone - index 0): text inputs group, lists...)
 *   - expand Bool (ONLY if group controls (left drop zone - index 0): text inputs group, lists...)
 * 
 */
var ngwfDdDecorContainerDirective = angular.module('ngwfApp.directives.ngwfDdDecorContainerDirective', []);
ngwfDdDecorContainerDirective.directive('ddDecorContainer', [function(){
        var htmlTemplate   = [
                                '<div ng-click="collapseFct()">',
                                '   <h6><span class="glyphicon {{currentIconClass()}}"></span>&nbsp;{{currentTitle}}</h6>', 
                                '</div>',
                                '<div collapse="isCollapsed">', 
                                '   <div id="ddDecorContainerWillTranscludeHere"></div>', 
                                '</div>'].join(' ');

        return {
            scope:  {
                        'styleParam': '=ddContainerProperties',
                         'verboseMode' : '@ddContainerVerboseMode',
                         'currentIndex' : '@ddContainerCurrentIndex',
                    },
            restrict: 'A', 
            template: htmlTemplate,
            transclude: true,
            controller: function($scope, $element, $attrs, $transclude) {

                            $scope.collapseFct = function(){
                                $scope.isCollapsed = !$scope.isCollapsed;
                                console.info('collasped : ' + $scope.isCollapsed);
                            };

                            $scope.icons = {
                                closedClass : 'glyphicon-eye-open',
                                opened : 'glyphicon-eye-close'
                            };


                            $scope.currentIconClass =  function(){
                                    if ($scope.isCollapsed) {
                                        return $scope.icons.closedClass;
                                    }else{
                                        return $scope.icons.opened;
                                    }
                            };

                        },
            link: function($scope, element, attrs, ctrl, transclude) {    
                
                var verboseModeActive = $scope.verboseMode;
                var currentIndex = $scope.currentIndex;
                $scope.isCollapsed = false;


                //verbose mode : just for dev
                if (verboseModeActive !== '') {
                    var verbose = angular.lowercase(verboseModeActive);

                    if (verbose === 'true' || verbose === '1') {
                       console.dir(
                            {
                                whoAmI : 'I am verbose from ddDecorContainer link',
                                verbodeMode : verbose,
                                ParentParentIndex : $scope.$parent.$parent.$index,
                                ParentIndex : $scope.$parent.$index,
                                currentIndex: currentIndex,
                                styleParam : $scope.styleParam
                            }
                        );
                    }                    
                }


                 if (typeof currentIndex !== 'undefined') {
                    if (currentIndex !== '') {

                        //specific 1st column
                        if (currentIndex === '0') {
                            //apply title 

                            if (typeof $scope.styleParam.title !== 'undefined') {

                                $scope.currentTitle = $scope.styleParam.title;
                            } 

                        }
                    }                    
                }
                //prevent transclusion creating child scope 
                //want to know more about what I'm saying : check this nice tip on the subject :
                //http://angular-tips.com/blog/2014/03/transclusion-and-scopes/        
                transclude($scope.$parent, function(contentClone){
                    //transclusion will append content to '<div id="ddDecorContainerWillTranscludeHere"></div>'
                    var childDiv = angular.element(element.children()[1]); 
                    childDiv.append(contentClone);
                });   
            }
        };

    

        function isDestinationContainer(node){
            var yesItIs = false;
            
            if (node.tagName &&  (
                    node.hasAttribute('dd-decor-include-container-here') ||
                    node.tagName.toLowerCase() === 'dd-decor-include-container-here')) {
                
                yesItIs = true;
            }
            return yesItIs;
        }

    }]);

