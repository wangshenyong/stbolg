/*ChartLine折线图开始*/
/**
 * uicahrt
 * @author json liu
 * line 折线图
 * doughnut 环形图
 */
(function(window, vx, undefined) {'use strict';
	ibsapp.factory('$chartService', ['$log', '$timeout',
	function($log, $timeout) {
		for (var temp in window._Chart) {
			window._Chart[temp].call(window);
		}
		return {
			line : function(dom, data) {
				var keys = [], values = [], field = [], i;
				for (i in data[0]) {
					field.push(i);
				}
				for ( i = 0; i < data.length; i++) {
					var temp = data[i];
					keys.push(temp[field[0]]);
					values.push(temp[field[1]]);
				}
				var lineChartData = {
					labels : keys,
					datasets : [{
						label : "My dataset",
						fillColor : "rgba(255,255,0,0.2)",
						strokeColor : "rgba(255,0,0,1)",
						pointColor : "rgba(255,0,0,1)",
						pointStrokeColor : "#fff",
						pointHighlightFill : "#fff",
						pointHighlightStroke : "rgba(151,187,205,1)",
						data : values
					}]
				}

				$timeout(function() {
					var ctx = dom.getContext("2d");
					window.myLine = new Chart(ctx).Line(lineChartData, {
						showTooltips : true,
						// String - Tooltip background colour
						tooltipFillColor : "rgba(255,0,0,0.8)",
						// String - Template string for single tooltips
						tooltipTemplate : "<%if (label){%><%}%><%= value %>",
						responsive : true,
						//Boolean - If we want to override with a hard coded scale
						scaleOverride : false,
						//** Required if scaleOverride is true **
						//Number - The number of steps in a hard coded scale
						scaleSteps : 6,
						//Number - The value jump in the hard coded scale
						scaleStepWidth : 0.2,
						// Y 轴的起始值
						scaleStartValue : 2,
						// 是否使用贝塞尔曲线? 即:线条是否弯曲
						bezierCurve : false,
						onAnimationComplete : function() {
							this.activeElements = [{
								saved : Object,
								controlPoints : Object,
								datasetLabel : "My dataset",
								fillColor : "#fff",
								highlightFill : "#fff",
								highlightStroke : "rgba(151,187,205,1)",
								label : "5/26",
								strokeColor : "rgba(151,187,205,1)",
								value : 4.3,
								x : 598,
								y : 132.3458333333333
							}];
							// var params=[];
							// params[0]=this.datasets[0].points[this.datasets[0].points.length-1];
							Chart.Type.prototype.showTooltip.call(this, this.datasets[0].points.slice(-1));
						}
					});
				}, 100);
			},
			doughnut : function(dom,options) {
				var doughnutData=[{
					value : options.usedAmount,
					color : "#FB953B",
					highlight : "#FB953B",
					label : options.useLabel
				}, {
					value : options.loanAmount,
					color : "#EF505D",
					highlight : "#EF505D",
					label : options.loanLabel
				}];
				$timeout(function() {
					var ctx = dom.getContext("2d");
					var myDoughnut = new Chart(ctx).Doughnut(doughnutData, {
						responsive : true
					});
				}, 100);
			}
		};
	}]);
})(window, window.vx);
/*ChartLine折线图结束*/