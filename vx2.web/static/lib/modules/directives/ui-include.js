/**
 * @ngdoc event
 * @name ngInclude#$includeContentError
 * @eventType emit on the scope ngInclude was declared in
 * @description
 * Emitted when a template HTTP request yields an erroneous response (status < 200 || status > 299)
 *
 * @param {Object} vxEvent Synthetic event object.
 * @param {String} src URL of content to load.
 */
(function (window, vx, undefined) {
	'use strict';
	var ibsapp = vx.module("ui.libraries");
	var uiIncludeDirective = ['$templateRequest', '$anchorScroll', '$animate', '$compile',
		function ($templateRequest, $anchorScroll, $animate, $compile) {
			return {
				restrict: 'ECA',
				priority: 400,
				terminal: true,
				transclude: 'element',
				controller: vx.noop,
				compile: function (element, attr) {
					var srcExp = attr.uiInclude || attr.src, onloadExp = attr.onload || '', autoScrollExp = attr.autoscroll;

					return function (scope, $element, $attr, ctrl, $transclude) {
						var changeCounter = 0, currentScope, previousElement, currentElement;

						var cleanupLastIncludeContent = function () {
							if (previousElement) {
								previousElement.remove();
								previousElement = null;
							}
							if (currentScope) {
								currentScope.$destroy();
								currentScope = null;
							}
							if (currentElement) {
								$animate.leave(currentElement).then(function () {
									previousElement = null;
								});
								previousElement = currentElement;
								currentElement = null;
							}
						};

						scope.$watch(srcExp, function ngIncludeWatchAction(src) {
							var afterAnimation = function () {
								if (vx.isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
									$anchorScroll();
								}
							};
							var thisChangeId = ++changeCounter;
							if (isNaN(src)) {
								src = srcExp;
							}
							if (src) {
								//set the 2nd param to true to ignore the template request error so that the inner
								//contents and scope can be cleaned up.
								$templateRequest(src, true).then(function (response) {
									if (thisChangeId !== changeCounter)
										return;
									//var newScope = scope.$new();
									var newScope = scope;
									ctrl.template = response;

									// Note: This will also link all children of ui-include that were contained in the original
									// html. If that content contains controllers, ... they could pollute/change the scope.
									// However, using ng-include on an element with additional content does not make sense...
									// Note: We can't remove them in the cloneAttchFn of $transclude as that
									// function is called before linking the content, which would apply child
									// directives to non existing elements.
									var clone = $transclude(newScope, function (clone) {
										cleanupLastIncludeContent();
										$animate.enter(clone, null, $element).then(afterAnimation);
									});

									currentScope = newScope;
									currentElement = clone;

									currentElement.html(ctrl.template);
									$compile(currentElement.contents())(currentScope);

									currentScope.$emit('$includeContentLoaded', src);
									scope.$eval(onloadExp);
								}, function () {
									if (thisChangeId === changeCounter) {
										cleanupLastIncludeContent();
										scope.$emit('$includeContentError', src);
									}
								});
								scope.$emit('$includeContentRequested', src);
							} else {
								cleanupLastIncludeContent();
								ctrl.template = null;
							}
						});
					};
				}
			};
		}];
	ibsapp.directive("uiInclude", uiIncludeDirective);
})(window, window.vx);