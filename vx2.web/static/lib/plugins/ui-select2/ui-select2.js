/**
 * @author LiuYoucai
 */
(function (window,vx,undefined) {
	'use strict';

	var directive = {};

	directive.uiSelect2 = [ '$compile', function ($compile) {
		return {
			require : '?ngModel',
			restrict : 'CA',
			compile : function (tElm,tAttrs) {
				if (vx.msie < 8) {
					return false;
				}
				var watch, repeatOption, isSelect = tElm.is('select'), isMultiple = (tAttrs.multiple !== undefined);

				// Enable watching of the options dataset if in use
				if (tElm.is('select')) {
					repeatOption = tElm.find('option[v-repeat]');
					if (repeatOption.length) {
						watch = repeatOption.attr('v-repeat').split(' ').pop();
					}
				}

				return function (scope,elm,attrs,controller) {
					// instance-specific options
					var opts = $.extend({}, scope.$eval(attrs.uiSelect2));
					if (isSelect) {
						// Use <select multiple> instead
						delete opts.multiple;
						delete opts.initSelection;
					} else if (isMultiple) {
						opts.multiple = true;
					}
					if (controller) {
						// Watch the model for programmatic changes
						controller.$render = function () {
							if (isSelect) {
								elm.select2('val', controller.$modelValue);
								initSelectData(scope, elm);
							} else {
								if (isMultiple && !controller.$modelValue) {
									elm.select2('data', []);
								} else {
									elm.select2('data', controller.$modelValue);
								}
							}
						};
						//anti watch the model (let control handler in the ctrl)
						scope.$watch(attrs.vModel, function(currObj) {
							controller.$render = function () {
								initSelectData(scope, elm, opts.textName);
							};
						});
						// Watch the options dataset for changes
						if (watch) {
							scope.$watch(watch, function (newVal,oldVal,scope) {
								if (!newVal)
									return;
								// Delayed so that the options have time
								// to be rendered
								setTimeout(function () {
									elm.select2('val', controller.$viewValue);
									// Refresh vx to remove the
									// superfluous option
									elm.trigger('change');
								});
							});
						}

						if (!isSelect) {
							// Set the view and model value and update
							// the vx template manually for the
							// ajax/multiple select2.
							elm.bind("change", function () {
								scope.$apply(function () {
									controller.$setViewValue(elm.select2('data'));
								});
							});

							if (opts.initSelection) {
								var initSelection = opts.initSelection;
								opts.initSelection = function (element,callback) {
									initSelection(element, function (value) {
										controller.$setViewValue(value);
										callback(value);
									});
								};
							}
						}
					}

					attrs.$observe('disabled', function (value) {
						elm.select2(value && 'disable' || 'enable');
					});

					// Set initial value since Angular doesn't
					elm.val(scope.$eval(attrs.vModel));

					// Initialize the plugin late so that the injected
					// DOM does not disrupt the template compiler
					setTimeout(function () {
						elm.select2(opts);
						initSelectData(scope, elm);
					});
				};
			}
		};
	} ];
	vx.module('ibsapp').directive(directive);

})(window, window.vx);

function initSelectData (scope,elm,textName) {
	var s2Span = $("#s2id_" + elm.attr('id') + " > a > span");
	var vModel = elm.attr('v-model');
	if (s2Span !== null) {
		s2Span.empty();
		if (vModel && scope.$eval(vModel)  && scope.$eval(vModel)[textName]) {
			s2Span.html(scope.$eval(vModel)[textName]);
			return;
		}
		var text = elm.find('option:selected').text();
		if (text === null || text === "") {
			if (elm.find('option:first').val() === null || elm.find('option:first').val() === "") {
				text = elm.find('option:first').text();
			}
		}
		s2Span.html(text);
	}
}
