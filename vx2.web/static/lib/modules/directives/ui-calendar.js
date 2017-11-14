/**
 * @author JiangLei
 * showNow: 为true就显示当前日期,若要在当前日期上进行偏移则使用表达式：xxYxxMxxD,xx表示要偏移的时间，Y:年,M:月,D:日
 */

(function (window, vx, undefined) {
    'use strict';

    var directive = {};

    directive.uiCalendar = [
        function () {
            var defaults={
            };
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {

                    var options = $.extend({}, defaults, vx.fromJson(attrs.uiCalendar || {}));
                    function UTCDate() {
                        return new Date(Date.UTC.apply(Date, arguments));
                    }

                    function UTCToday() {
                        var today = new Date();
                        return UTCDate(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), today.getUTCHours(), today.getUTCMinutes(), today.getUTCSeconds(), 0);
                    }
                    function transDate(pattern){

                    }

                    // Picker object

                    var Datetimepicker = function (element, options) {
                        var that = this;

                        this.element = vx.element(element);
                        this.language = options.language || this.element.data('date-language') || "zh_CN";
                        this.language = this.language in dates ? this.language : "zh_CN";
                        this.isRTL = dates[this.language].rtl || false;
                        this.formatType = options.formatType || this.element.data('format-type') || 'standard';
                        this.format = DPGlobal.parseFormat(options.format || this.element.data('date-format') || DPGlobal.getDefaultFormat(this.formatType, 'input'), this.formatType);
                        this.isInline = false;
                        this.isVisible = false;
                        this.isInput = this.element.is('input');
                        this.component = this.element.is('.date') ? this.element.find('.add-on .icon-th, .add-on .icon-time, .add-on .icon-calendar').parent() : false;
                        this.componentReset = this.element.is('.date') ? this.element.find('.add-on .icon-remove').parent() : false;
                        this.hasInput = this.component && this.element.find('input').length;
                        if (this.component && this.component.length === 0) {
                            this.component = false;
                        }
                        this.linkField = options.linkField || this.element.data('link-field') || false;
                        this.linkFormat = DPGlobal.parseFormat(options.linkFormat || this.element.data('link-format') || DPGlobal.getDefaultFormat(this.formatType, 'link'), this.formatType);
                        this.minuteStep = options.minuteStep || this.element.data('minute-step') || 5;
                        this.pickerPosition = options.pickerPosition || this.element.data('picker-position') || 'bottom-right';
                        this.showMeridian = options.showMeridian || this.element.data('show-meridian') || false;
                        this.initialDate = options.initialDate || new Date();
                        this.showNow = options.showNow;

                        this._attachEvents();

                        this.formatViewType = "datetime";
                        if ('formatViewType' in options) {
                            this.formatViewType = options.formatViewType;
                        } else if ('formatViewType' in this.element.data()) {
                            this.formatViewType = this.element.data('formatViewType');
                        }

                        this.minView = 0;
                        if ('minView' in options) {
                            this.minView = options.minView;
                        } else if ('minView' in this.element.data()) {
                            this.minView = this.element.data('min-view');
                        }
                        this.minView = DPGlobal.convertViewMode(this.minView);

                        this.maxView = DPGlobal.modes.length - 1;
                        if ('maxView' in options) {
                            this.maxView = options.maxView;
                        } else if ('maxView' in this.element.data()) {
                            this.maxView = this.element.data('max-view');
                        }
                        this.maxView = DPGlobal.convertViewMode(this.maxView);

                        this.startViewMode = 2;
                        if ('startView' in options) {
                            this.startViewMode = options.startView;
                        } else if ('startView' in this.element.data()) {
                            this.startViewMode = this.element.data('start-view');
                        }
                        this.startViewMode = DPGlobal.convertViewMode(this.startViewMode);
                        this.viewMode = this.startViewMode;

                        this.viewSelect = this.minView;
                        if ('viewSelect' in options) {
                            this.viewSelect = options.viewSelect;
                        } else if ('viewSelect' in this.element.data()) {
                            this.viewSelect = this.element.data('view-select');
                        }
                        this.viewSelect = DPGlobal.convertViewMode(this.viewSelect);

                        this.forceParse = true;
                        if ('forceParse' in options) {
                            this.forceParse = options.forceParse;
                        } else if ('dateForceParse' in this.element.data()) {
                            this.forceParse = this.element.data('date-force-parse');
                        }

                        this.picker = vx.element(DPGlobal.template)
                            .appendTo(this.isInline ? this.element : 'body')
                            .on({
                                click: $.proxy(this.click, this),
                                mousedown: $.proxy(this.mousedown, this)
                            });

                        if (this.isInline) {
                            this.picker.addClass('calendar-inline');
                        } else {
                            this.picker.addClass('calendar-dropdown-' + this.pickerPosition + ' dropdown-menu');
                        }
                        if (this.isRTL) {
                            this.picker.addClass('calendar-rtl');
                            this.picker.find('.prev i, .next i')
                                .toggleClass('icon-arrow-left icon-arrow-right');
                        }
                        vx.element(document).on('mousedown', function (e) {
                            // Clicked outside the datetimepicker, hide it
                            if (vx.element(e.target).closest('.calendar').length === 0) {
                                that.hide();
                            }
                        });

                        this.autoclose = false;
                        if ('autoclose' in options) {
                            this.autoclose = options.autoclose;
                        } else if ('dateAutoclose' in this.element.data()) {
                            this.autoclose = this.element.data('date-autoclose');
                        }

                        this.keyboardNavigation = true;
                        if ('keyboardNavigation' in options) {
                            this.keyboardNavigation = options.keyboardNavigation;
                        } else if ('dateKeyboardNavigation' in this.element.data()) {
                            this.keyboardNavigation = this.element.data('date-keyboard-navigation');
                        }

                        this.todayBtn = (options.todayBtn || this.element.data('date-today-btn') || false);
                        this.todayHighlight = (options.todayHighlight || this.element.data('date-today-highlight') || false);

                        this.weekStart = ((options.weekStart || this.element.data('date-weekstart') || dates[this.language].weekStart || 0) % 7);
                        this.weekEnd = ((this.weekStart + 6) % 7);
                        this.startDate = -Infinity;
                        this.endDate = Infinity;
                        this.daysOfWeekDisabled = [];
                        this.setStartDate(options.startDate || this.element.data('date-startdate'));
                        this.setEndDate(options.endDate || this.element.data('date-enddate'));
                        this.setDaysOfWeekDisabled(options.daysOfWeekDisabled || this.element.data('date-days-of-week-disabled'));
                        this.fillDow();
                        this.fillMonths();
                        this.update();
                        this.showMode();

                     // fixed by xwx to set Today to input
                        var vmodelval = null;
                        if (!this.isInput) {
                            if (this.component)
                            	vmodelval = scope[this.element.find('[v-model]').attr("v-model")];
                        } else {
                        	vmodelval = scope[this.element.attr("v-model")];
                        }
                        if(!vmodelval)
                        {
                        	var rightdirty = false;
                        	if(vx.isString(this.showNow) && this.showNow.length > 0)
                        	{
                        		var reg= new RegExp("^(-?\\d+Y)?(-?\\d+M)?(-?\\d+D)?$") , matchres,
                        			mapdataunit = ["Y","M","D"],
                        			mapmovetimefun=["moveYear","moveMonth","moveDate"];
                        		matchres = reg.exec(this.showNow);
                        		if(matchres)
                        		{
                        			for(var matchi = 1; matchi < matchres.length; matchi++)
                        			{
                        				var item = matchres[matchi];
                        				if(!item)
                        					continue;
                        				item = parseInt(item.replace(mapdataunit[matchi-1],""));
                        				this.date = this[mapmovetimefun[matchi-1]](this.date,item);
                        				rightdirty = true;
                        			}
                        		}
                        	}
                        	if(typeof(this.showNow)=="boolean"&& this.showNow || rightdirty)

                        		this.setValue(false);
                        }
                        if (this.isInline) {
                            this.show();
                        }
                    };

                    Datetimepicker.prototype = {
                        constructor: Datetimepicker,

                        _events: [],
                        _attachEvents: function () {
                            this._detachEvents();
                            if (this.isInput) { // single input
                                this._events = [
                                    [this.element, {
                                        focus: $.proxy(this.show, this),
                                        click: $.proxy(this.show, this),
                                        keyup: $.proxy(this.update, this),
                                        keydown: $.proxy(this.keydown, this)
                                    }]
                                ];
                            }
                            else if (this.component && this.hasInput) { // component: input + button
                                this._events = [
                                    // For components that are not readonly, allow keyboard nav
                                    [this.element.find('input'), {
                                        focus: $.proxy(this.show, this),
                                        click: $.proxy(this.show, this),
                                        keyup: $.proxy(this.update, this),
                                        keydown: $.proxy(this.keydown, this)
                                    }],
                                    [this.component, {
                                        click: $.proxy(this.show, this)
                                    }]
                                ];
                                if (this.componentReset) {
                                    this._events.push([
                                        this.componentReset,
                                        {click: $.proxy(this.reset, this)}
                                    ]);
                                }
                            }
                            else if (this.element.is('div')) {  // inline datetimepicker
                                this.isInline = true;
                            }
                            else {
                                this._events = [
                                    [this.element, {
                                        click: $.proxy(this.show, this)
                                    }]
                                ];
                            }
                            for (var i = 0, el, ev; i < this._events.length; i++) {
                                el = this._events[i][0];
                                ev = this._events[i][1];
                                el.on(ev);
                            }
                        },

                        _detachEvents: function () {
                            for (var i = 0, el, ev; i < this._events.length; i++) {
                                el = this._events[i][0];
                                ev = this._events[i][1];
                                el.off(ev);
                            }
                            this._events = [];
                        },

                        show: function (e) {
                            this.picker.show();
                            this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
                            if (this.forceParse) {
                                this.update();
                            }
                            this.place();
                            vx.element(window).on('resize', $.proxy(this.place, this));
                            if (e) {
                                e.stopPropagation();
                                e.preventDefault();
                            }
                            this.isVisible = true;
                            this.element.trigger({
                                type: 'show',
                                date: this.date
                            });
                            //fixed the ie bug which the element with css using hover can't effective --- by xwx
                            if( /msie/.test(navigator.userAgent.toLowerCase()) && $.browser.version == "6.0")
                            	this.picker.find(".calendar-days table td,table td span").each(function(){
                                	$(this).live("mouseenter ",function(){
                                    	$(this).addClass("elhover");
                                    	}).live("mouseleave ",function(){
                                    		$(this).removeClass("elhover");
                                    	});
                                });
                        },

                        hide: function (e) {
                            if (!this.isVisible) return;
                            if (this.isInline) return;
                            this.picker.hide();
                            vx.element(window).off('resize', this.place);
                            this.viewMode = this.startViewMode;
                            this.showMode();
                            if (!this.isInput) {
                                vx.element(document).off('mousedown', this.hide);
                            }

                            if (
                                this.forceParse &&
                                    (
                                        this.isInput && this.element.val() ||
                                            this.hasInput && this.element.find('input').val()
                                        )
                                )
                                this.setValue();
                            this.isVisible = false;
                            this.element.trigger({
                                type: 'hide',
                                date: this.date
                            });
                        },

                        remove: function () {
                            this._detachEvents();
                            this.picker.remove();
                            delete this.element.data().datetimepicker;
                        },

                        getDate: function () {
                            var d = this.getUTCDate();
                            return new Date(d.getTime() + (d.getTimezoneOffset() * 60000));
                        },

                        getUTCDate: function () {
                            return this.date;
                        },

                        setDate: function (d) {
                            this.setUTCDate(new Date(d.getTime() - (d.getTimezoneOffset() * 60000)));
                        },

                        setUTCDate: function (d) {
                            if (d >= this.startDate && d <= this.endDate) {
                                this.date = d;
                                this.setValue();
                                this.viewDate = this.date;
                                this.fill();
                            } else {
                                this.element.trigger({
                                    type: 'outOfRange',
                                    date: d,
                                    startDate: this.startDate,
                                    endDate: this.endDate
                                });
                            }
                        },

                        setFormat: function (format) {
                            this.format = DPGlobal.parseFormat(format, this.formatType);
                            var element;
                            if (this.isInput) {
                                element = this.element;
                            } else if (this.component) {
                                element = this.element.find('input');
                            }
                            if (element && element.val()) {
                                this.setValue();
                            }
                        },

                        setValue: function () {
                            var formatted = this.getFormattedDate();
                            if (!this.isInput) {
                                if (this.component) {
                                    element.find('input').val(formatted);
                                    scope[element.find('[v-model]').attr("v-model")]=formatted;
                                }
                                element.data('date', formatted);
                            } else {
                                element.val(formatted);
                                scope[element.attr("v-model")]=formatted;
                            }
                            if (this.linkField) {
                                vx.element('#' + this.linkField).val(this.getFormattedDate(this.linkFormat));
                            }
                            if (arguments.length == 0 ||  arguments[0] ) // fixed by xwx
                            	scope.$apply(scope);

                        },

                        getFormattedDate: function (format) {
                            if (format == undefined) format = this.format;
                            return DPGlobal.formatDate(this.date, format, this.language, this.formatType);
                        },

                        setStartDate: function (startDate) {
                            this.startDate = startDate || -Infinity;
                            if (this.startDate !== -Infinity) {
                                this.startDate = DPGlobal.parseDate(this.startDate, this.format, this.language, this.formatType);
                            }
                            this.update();
                            this.updateNavArrows();
                        },

                        setEndDate: function (endDate) {
                            this.endDate = endDate || Infinity;
                            if (this.endDate !== Infinity) {
                                this.endDate = DPGlobal.parseDate(this.endDate, this.format, this.language, this.formatType);
                            }
                            this.update();
                            this.updateNavArrows();
                        },

                        setDaysOfWeekDisabled: function (daysOfWeekDisabled) {
                            this.daysOfWeekDisabled = daysOfWeekDisabled || [];
                            if (!$.isArray(this.daysOfWeekDisabled)) {
                                this.daysOfWeekDisabled = this.daysOfWeekDisabled.split(/,\s*/);
                            }
                            this.daysOfWeekDisabled = $.map(this.daysOfWeekDisabled, function (d) {
                                return parseInt(d, 10);
                            });
                            this.update();
                            this.updateNavArrows();
                        },

                        place: function () {
                            if (this.isInline) return;
                            var zIndex = parseInt(this.element.parents().filter(function () {
                                return vx.element(this).css('z-index') != 'auto';
                            }).first().css('z-index')) + 3000;
                            var offset, top, left;
                            if (this.component) {
                                offset = this.component.offset();
                                left = offset.left;
                                if (this.pickerPosition == 'bottom-left' || this.pickerPosition == 'top-left') {
                                    left += this.component.outerWidth() - this.picker.outerWidth();
                                }
                            } else {
                                offset = this.element.offset();
                                left = offset.left;
                            }
                            if (this.pickerPosition == 'top-left' || this.pickerPosition == 'top-right') {
                                top = offset.top - this.picker.outerHeight();
                            } else {
                                top = offset.top + this.height;
                            }
                            this.picker.css({
                                top: top,
                                left: left,
                                zIndex: zIndex
                            });
                        },

                        update: function () {
                            var date, fromArgs = false;
                            if (arguments && arguments.length && (typeof arguments[0] === 'string' || arguments[0] instanceof Date)) {
                                date = arguments[0];
                                fromArgs = true;
                            } else {
                                date = this.element.data('date') || (this.isInput ? this.element.val() : this.element.find('input').val()) || this.initialDate;
                            }

                            if (!date) {
                                date = new Date();
                                fromArgs = false;
                            }

                            this.date = DPGlobal.parseDate(date, this.format, this.language, this.formatType);

                            if (fromArgs) this.setValue();

                            if (this.date < this.startDate) {
                                this.viewDate = new Date(this.startDate);
                            } else if (this.date > this.endDate) {
                                this.viewDate = new Date(this.endDate);
                            } else {
                                this.viewDate = new Date(this.date);
                            }
                            this.fill();
                        },

                        fillDow: function () {
                            var dowCnt = this.weekStart,
                                html = '<tr>';
                            while (dowCnt < this.weekStart + 7) {
                                html += '<th class="dow">' + dates[this.language].daysMin[(dowCnt++) % 7] + '</th>';
                            }
                            html += '</tr>';
                            this.picker.find('.calendar-days thead').append(html);
                        },

                        fillMonths: function () {
                            var html = '',
                                i = 0;
                            while (i < 12) {
                                html += '<span class="month">' + dates[this.language].monthsShort[i++] + '</span>';
                            }
                            this.picker.find('.calendar-months td').html(html);
                        },

                        fill: function () {
                            if (this.date == null || this.viewDate == null) {
                                return;
                            }
                            var d = new Date(this.viewDate),
                                year = d.getUTCFullYear(),
                                month = d.getUTCMonth(),
                                dayMonth = d.getUTCDate(),
                                hours = d.getUTCHours(),
                                minutes = d.getUTCMinutes(),
                                startYear = this.startDate !== -Infinity ? this.startDate.getUTCFullYear() : -Infinity,
                                startMonth = this.startDate !== -Infinity ? this.startDate.getUTCMonth() : -Infinity,
                                endYear = this.endDate !== Infinity ? this.endDate.getUTCFullYear() : Infinity,
                                endMonth = this.endDate !== Infinity ? this.endDate.getUTCMonth() : Infinity,
                                currentDate = (new UTCDate(this.date.getUTCFullYear(), this.date.getUTCMonth(), this.date.getUTCDate())).valueOf(),
                                today = new Date();
                            this.picker.find('.calendar-days thead th:eq(1)')
                                .text(dates[this.language].months[month] + ' ' + year);
                            if (this.formatViewType == "time") {
                                var hourConverted = hours % 12 ? hours % 12 : 12;
                                var hoursDisplay = (hourConverted < 10 ? '0' : '') + hourConverted;
                                var minutesDisplay = (minutes < 10 ? '0' : '') + minutes;
                                var meridianDisplay = dates[this.language].meridiem[hours < 12 ? 0 : 1];
                                this.picker.find('.calendar-hours thead th:eq(1)')
                                    .text(hoursDisplay + ':' + minutesDisplay + ' ' + meridianDisplay.toUpperCase());
                                this.picker.find('.calendar-minutes thead th:eq(1)')
                                    .text(hoursDisplay + ':' + minutesDisplay + ' ' + meridianDisplay.toUpperCase());
                            } else {
                                this.picker.find('.calendar-hours thead th:eq(1)')
                                    .text(dayMonth + ' ' + dates[this.language].months[month] + ' ' + year);
                                this.picker.find('.calendar-minutes thead th:eq(1)')
                                    .text(dayMonth + ' ' + dates[this.language].months[month] + ' ' + year);
                            }
                            this.picker.find('tfoot th.today')
                                .text(dates[this.language].today)
                                .toggle(this.todayBtn !== false);
                            this.updateNavArrows();
                            this.fillMonths();
                            /*var prevMonth = UTCDate(year, month, 0,0,0,0,0);
                             prevMonth.setUTCDate(prevMonth.getDate() - (prevMonth.getUTCDay() - this.weekStart + 7)%7);*/
                            var prevMonth = UTCDate(year, month - 1, 28, 0, 0, 0, 0),
                                day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
                            prevMonth.setUTCDate(day);
                            prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.weekStart + 7) % 7);
                            var nextMonth = new Date(prevMonth);
                            nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
                            nextMonth = nextMonth.valueOf();
                            var html = [];
                            var clsName;
                            while (prevMonth.valueOf() < nextMonth) {
                                if (prevMonth.getUTCDay() == this.weekStart) {
                                    html.push('<tr>');
                                }
                                clsName = '';
                                if (prevMonth.getUTCFullYear() < year || (prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() < month)) {
                                    clsName += ' old';
                                } else if (prevMonth.getUTCFullYear() > year || (prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() > month)) {
                                    clsName += ' new';
                                }
                                // Compare internal UTC date with local today, not UTC today
                                if (this.todayHighlight &&
                                    prevMonth.getUTCFullYear() == today.getFullYear() &&
                                    prevMonth.getUTCMonth() == today.getMonth() &&
                                    prevMonth.getUTCDate() == today.getDate()) {
                                    clsName += ' today';
                                }
                                if (prevMonth.valueOf() == currentDate) {
                                    clsName += ' active';
                                }
                                if ((prevMonth.valueOf() + 86400000) <= this.startDate || prevMonth.valueOf() > this.endDate ||
                                    $.inArray(prevMonth.getUTCDay(), this.daysOfWeekDisabled) !== -1) {
                                    clsName += ' disabled';
                                }
                                html.push('<td class="day' + clsName + '">' + prevMonth.getUTCDate() + '</td>');
                                if (prevMonth.getUTCDay() == this.weekEnd) {
                                    html.push('</tr>');
                                }
                                prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
                            }
                            this.picker.find('.calendar-days tbody').empty().append(html.join(''));
                            this.picker.find('.calendar-days tbody tr td:first-child').addClass("tdColor");
                            this.picker.find('.calendar-days tbody tr td:last-child').addClass("tdColor");

                            html = [];
                            var txt = '', meridian = '', meridianOld = '';
                            for (var i = 0; i < 24; i++) {
                                var actual = UTCDate(year, month, dayMonth, i);
                                clsName = '';
                                // We want the previous hour for the startDate
                                if ((actual.valueOf() + 3600000) <= this.startDate || actual.valueOf() > this.endDate) {
                                    clsName += ' disabled';
                                } else if (hours == i) {
                                    clsName += ' active';
                                }
                                if (this.showMeridian && dates[this.language].meridiem.length == 2) {
                                    meridian = (i < 12 ? dates[this.language].meridiem[0] : dates[this.language].meridiem[1]);
                                    if (meridian != meridianOld) {
                                        if (meridianOld != '') {
                                            html.push('</fieldset>');
                                        }
                                        html.push('<fieldset class="hour"><legend>' + meridian.toUpperCase() + '</legend>');
                                    }
                                    meridianOld = meridian;
                                    txt = (i % 12 ? i % 12 : 12);
                                    html.push('<span class="hour' + clsName + ' hour_' + (i < 12 ? 'am' : 'pm') + '">' + txt + '</span>');
                                    if (i == 23) {
                                        html.push('</fieldset>');
                                    }
                                } else {
                                    txt = i + ':00';
                                    html.push('<span class="hour' + clsName + '">' + txt + '</span>');
                                }
                            }
                            this.picker.find('.calendar-hours td').html(html.join(''));

                            html = [];
                            txt = '', meridian = '', meridianOld = '';
                            for (var i = 0; i < 60; i += this.minuteStep) {
                                var actual = UTCDate(year, month, dayMonth, hours, i, 0);
                                clsName = '';
                                if (actual.valueOf() < this.startDate || actual.valueOf() > this.endDate) {
                                    clsName += ' disabled';
                                } else if (Math.floor(minutes / this.minuteStep) == Math.floor(i / this.minuteStep)) {
                                    clsName += ' active';
                                }
                                if (this.showMeridian && dates[this.language].meridiem.length == 2) {
                                    meridian = (hours < 12 ? dates[this.language].meridiem[0] : dates[this.language].meridiem[1]);
                                    if (meridian != meridianOld) {
                                        if (meridianOld != '') {
                                            html.push('</fieldset>');
                                        }
                                        html.push('<fieldset class="minute"><legend>' + meridian.toUpperCase() + '</legend>');
                                    }
                                    meridianOld = meridian;
                                    txt = (hours % 12 ? hours % 12 : 12);
                                    //html.push('<span class="minute'+clsName+' minute_'+(hours<12?'am':'pm')+'">'+txt+'</span>');
                                    html.push('<span class="minute' + clsName + '">' + txt + ':' + (i < 10 ? '0' + i : i) + '</span>');
                                    if (i == 59) {
                                        html.push('</fieldset>');
                                    }
                                } else {
                                    txt = i + ':00';
                                    //html.push('<span class="hour'+clsName+'">'+txt+'</span>');
                                    html.push('<span class="minute' + clsName + '">' + hours + ':' + (i < 10 ? '0' + i : i) + '</span>');
                                }
                            }
                            this.picker.find('.calendar-minutes td').html(html.join(''));

                            var currentYear = this.date.getUTCFullYear();
                            var months = this.picker.find('.calendar-months')
                                .find('th:eq(1)')
                                .text(year)
                                .end()
                                .find('span').removeClass('active');
                            if (currentYear == year) {
                                months.eq(this.date.getUTCMonth()).addClass('active');
                            }
                            if (year < startYear || year > endYear) {
                                months.addClass('disabled');
                            }
                            if (year == startYear) {
                                months.slice(0, startMonth).addClass('disabled');
                            }
                            if (year == endYear) {
                                months.slice(endMonth + 1).addClass('disabled');
                            }

                            html = '';
                            year = parseInt(year / 10, 10) * 10;
                            var yearCont = this.picker.find('.calendar-years')
                                .find('th:eq(1)')
                                .text(year + '-' + (year + 9))
                                .end()
                                .find('td');
                            year -= 1;
                            for (var i = -1; i < 11; i++) {
                                html += '<span class="year' + (i == -1 || i == 10 ? ' old' : '') + (currentYear == year ? ' active' : '') + (year < startYear || year > endYear ? ' disabled' : '') + '">' + year + '</span>';
                                year += 1;
                            }
                            yearCont.html(html);
                            this.place();
                        },

                        updateNavArrows: function () {
                            var d = new Date(this.viewDate),
                                year = d.getUTCFullYear(),
                                month = d.getUTCMonth(),
                                day = d.getUTCDate(),
                                hour = d.getUTCHours();
                            switch (this.viewMode) {
                                case 0:
                                    if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear()
                                        && month <= this.startDate.getUTCMonth()
                                        && day <= this.startDate.getUTCDate()
                                        && hour <= this.startDate.getUTCHours()) {
                                        this.picker.find('.prev').css({visibility: 'hidden'});
                                    } else {
                                        this.picker.find('.prev').css({visibility: 'visible'});
                                    }
                                    if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear()
                                        && month >= this.endDate.getUTCMonth()
                                        && day >= this.endDate.getUTCDate()
                                        && hour >= this.endDate.getUTCHours()) {
                                        this.picker.find('.next').css({visibility: 'hidden'});
                                    } else {
                                        this.picker.find('.next').css({visibility: 'visible'});
                                    }
                                    break;
                                case 1:
                                    if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear()
                                        && month <= this.startDate.getUTCMonth()
                                        && day <= this.startDate.getUTCDate()) {
                                        this.picker.find('.prev').css({visibility: 'hidden'});
                                    } else {
                                        this.picker.find('.prev').css({visibility: 'visible'});
                                    }
                                    if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear()
                                        && month >= this.endDate.getUTCMonth()
                                        && day >= this.endDate.getUTCDate()) {
                                        this.picker.find('.next').css({visibility: 'hidden'});
                                    } else {
                                        this.picker.find('.next').css({visibility: 'visible'});
                                    }
                                    break;
                                case 2:
                                    if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear()
                                        && month <= this.startDate.getUTCMonth()) {
                                        this.picker.find('.prev').css({visibility: 'hidden'});
                                    } else {
                                        this.picker.find('.prev').css({visibility: 'visible'});
                                    }
                                    if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear()
                                        && month >= this.endDate.getUTCMonth()) {
                                        this.picker.find('.next').css({visibility: 'hidden'});
                                    } else {
                                        this.picker.find('.next').css({visibility: 'visible'});
                                    }
                                    break;
                                case 3:
                                case 4:
                                    if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear()) {
                                        this.picker.find('.prev').css({visibility: 'hidden'});
                                    } else {
                                        this.picker.find('.prev').css({visibility: 'visible'});
                                    }
                                    if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear()) {
                                        this.picker.find('.next').css({visibility: 'hidden'});
                                    } else {
                                        this.picker.find('.next').css({visibility: 'visible'});
                                    }
                                    break;
                            }
                        },

                        click: function (e) {
                            e.stopPropagation();
                            e.preventDefault();
                            var target = vx.element(e.target).closest('span, td, th, legend');
                            if (target.length == 1) {
                                if (target.is('.disabled')) {
                                    this.element.trigger({
                                        type: 'outOfRange',
                                        date: this.viewDate,
                                        startDate: this.startDate,
                                        endDate: this.endDate
                                    });
                                    return;
                                }
                                switch (target[0].nodeName.toLowerCase()) {
                                    case 'th':
                                        switch (target[0].className) {
                                            case 'switch':
                                                this.showMode(1);
                                                break;
                                            case 'prev':
                                            case 'next':
                                                var dir = DPGlobal.modes[this.viewMode].navStep * (target[0].className == 'prev' ? -1 : 1);
                                                switch (this.viewMode) {
                                                    case 0:
                                                        this.viewDate = this.moveHour(this.viewDate, dir);
                                                        break;
                                                    case 1:
                                                        this.viewDate = this.moveDate(this.viewDate, dir);
                                                        break;
                                                    case 2:
                                                        this.viewDate = this.moveMonth(this.viewDate, dir);
                                                        break;
                                                    case 3:
                                                    case 4:
                                                        this.viewDate = this.moveYear(this.viewDate, dir);
                                                        break;
                                                }
                                                this.fill();
                                                break;
                                            case 'today':
                                                var date = new Date();
                                                date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0);

                                                this.viewMode = this.startViewMode;
                                                this.showMode(0);
                                                this._setDate(date);
                                                this.fill();
                                                if (this.autoclose) {
                                                    this.hide();
                                                }
                                                break;
                                        }
                                        break;
                                    case 'span':
                                        if (!target.is('.disabled')) {
                                            var year = this.viewDate.getUTCFullYear(),
                                                month = this.viewDate.getUTCMonth(),
                                                day = this.viewDate.getUTCDate(),
                                                hours = this.viewDate.getUTCHours(),
                                                minutes = this.viewDate.getUTCMinutes(),
                                                seconds = this.viewDate.getUTCSeconds();

                                            if (target.is('.month')) {
                                                this.viewDate.setUTCDate(1);
                                                month = target.parent().find('span').index(target);
                                                day = this.viewDate.getUTCDate();
                                                this.viewDate.setUTCMonth(month);
                                                this.element.trigger({
                                                    type: 'changeMonth',
                                                    date: this.viewDate
                                                });
                                                if (this.viewSelect >= 3) {
                                                    this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
                                                }
                                            } else if (target.is('.year')) {
                                                this.viewDate.setUTCDate(1);
                                                year = parseInt(target.text(), 10) || 0;
                                                this.viewDate.setUTCFullYear(year);
                                                this.element.trigger({
                                                    type: 'changeYear',
                                                    date: this.viewDate
                                                });
                                                if (this.viewSelect >= 4) {
                                                    this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
                                                }
                                            } else if (target.is('.hour')) {
                                                hours = parseInt(target.text(), 10) || 0;
                                                if (target.hasClass('hour_am') || target.hasClass('hour_pm')) {
                                                    if (hours == 12 && target.hasClass('hour_am')) {
                                                        hours = 0;
                                                    } else if (hours != 12 && target.hasClass('hour_pm')) {
                                                        hours += 12;
                                                    }
                                                }
                                                this.viewDate.setUTCHours(hours);
                                                this.element.trigger({
                                                    type: 'changeHour',
                                                    date: this.viewDate
                                                });
                                                if (this.viewSelect >= 1) {
                                                    this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
                                                }
                                            } else if (target.is('.minute')) {
                                                minutes = parseInt(target.text().substr(target.text().indexOf(':') + 1), 10) || 0;
                                                this.viewDate.setUTCMinutes(minutes);
                                                this.element.trigger({
                                                    type: 'changeMinute',
                                                    date: this.viewDate
                                                });
                                                if (this.viewSelect >= 0) {
                                                    this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
                                                }
                                            }
                                            if (this.viewMode != 0) {
                                                var oldViewMode = this.viewMode;
                                                this.showMode(-1);
                                                this.fill();
                                                if (oldViewMode == this.viewMode && this.autoclose) {
                                                    this.hide();
                                                }
                                            } else {
                                                this.fill();
                                                if (this.autoclose) {
                                                    this.hide();
                                                }
                                            }
                                        }
                                        break;
                                    case 'td':
                                        if (target.is('.day') && !target.is('.disabled')) {
                                            var day = parseInt(target.text(), 10) || 1;
                                            var year = this.viewDate.getUTCFullYear(),
                                                month = this.viewDate.getUTCMonth(),
                                                hours = this.viewDate.getUTCHours(),
                                                minutes = this.viewDate.getUTCMinutes(),
                                                seconds = this.viewDate.getUTCSeconds();
                                            if (target.is('.old')) {
                                                if (month === 0) {
                                                    month = 11;
                                                    year -= 1;
                                                } else {
                                                    month -= 1;
                                                }
                                            } else if (target.is('.new')) {
                                                if (month == 11) {
                                                    month = 0;
                                                    year += 1;
                                                } else {
                                                    month += 1;
                                                }
                                            }
                                            this.viewDate.setUTCDate(day);
                                            this.viewDate.setUTCMonth(month);
                                            this.viewDate.setUTCFullYear(year);
                                            this.element.trigger({
                                                type: 'changeDay',
                                                date: this.viewDate
                                            });
                                            if (this.viewSelect >= 2) {
                                                this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
                                            }
                                        }
                                        var oldViewMode = this.viewMode;
                                        this.showMode(-1);
                                        this.fill();
                                        this.hide();
                                        if (oldViewMode == this.viewMode && this.autoclose) {
                                            this.hide();
                                        }
                                        break;
                                }
                            }
                        },

                        _setDate: function (date, which) {
                            if (!which || which == 'date')
                                this.date = date;
                            if (!which || which == 'view')
                                this.viewDate = date;
                            this.fill();
                            this.setValue();
                            var element;
                            if (this.isInput) {
                                element = this.element;
                            } else if (this.component) {
                                element = this.element.find('input');
                            }
                            if (element) {
                                element.change();
                                if (this.autoclose && (!which || which == 'date')) {
                                    //this.hide();
                                }
                            }
                            this.element.trigger({
                                type: 'changeDate',
                                date: this.date
                            });
                        },

                        moveMinute: function (date, dir) {
                            if (!dir) return date;
                            var new_date = new Date(date.valueOf());
                            //dir = dir > 0 ? 1 : -1;
                            new_date.setUTCMinutes(new_date.getUTCMinutes() + (dir * this.minuteStep));
                            return new_date;
                        },

                        moveHour: function (date, dir) {
                            if (!dir) return date;
                            var new_date = new Date(date.valueOf());
                            //dir = dir > 0 ? 1 : -1;
                            new_date.setUTCHours(new_date.getUTCHours() + dir);
                            return new_date;
                        },

                        moveDate: function (date, dir) {
                            if (!dir) return date;
                            var new_date = new Date(date.valueOf());
                            //dir = dir > 0 ? 1 : -1;
                            new_date.setUTCDate(new_date.getUTCDate() + dir);
                            return new_date;
                        },

                        moveMonth: function (date, dir) {
                            if (!dir) return date;
                            var new_date = new Date(date.valueOf()),
                                day = new_date.getUTCDate(),
                                month = new_date.getUTCMonth(),
                                mag = Math.abs(dir),
                                new_month, test;
                            dir = dir > 0 ? 1 : -1;
                            if (mag == 1) {
                                test = dir == -1
                                    // If going back one month, make sure month is not current month
                                    // (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
                                    ? function () {
                                    return new_date.getUTCMonth() == month;
                                }
                                    // If going forward one month, make sure month is as expected
                                    // (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
                                    : function () {
                                    return new_date.getUTCMonth() != new_month;
                                };
                                new_month = month + dir;
                                new_date.setUTCMonth(new_month);
                                // Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
                                if (new_month < 0 || new_month > 11)
                                    new_month = (new_month + 12) % 12;
                            } else {
                                // For magnitudes >1, move one month at a time...
                                for (var i = 0; i < mag; i++)
                                    // ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
                                    new_date = this.moveMonth(new_date, dir);
                                // ...then reset the day, keeping it in the new month
                                new_month = new_date.getUTCMonth();
                                new_date.setUTCDate(day);
                                test = function () {
                                    return new_month != new_date.getUTCMonth();
                                };
                            }
                            // Common date-resetting loop -- if date is beyond end of month, make it
                            // end of month
                            while (test()) {
                                new_date.setUTCDate(--day);
                                new_date.setUTCMonth(new_month);
                            }
                            return new_date;
                        },

                        moveYear: function (date, dir) {
                            return this.moveMonth(date, dir * 12);
                        },

                        dateWithinRange: function (date) {
                            return date >= this.startDate && date <= this.endDate;
                        },

                        keydown: function (e) {
                            if (this.picker.is(':not(:visible)')) {
                                if (e.keyCode == 27) // allow escape to hide and re-show picker
                                    this.show();
                                return;
                            }
                            var dateChanged = false,
                                dir, day, month,
                                newDate, newViewDate, viewMode;
                            switch (e.keyCode) {
                                case 27: // escape
                                    this.hide();
                                    e.preventDefault();
                                    break;
                                case 37: // left
                                case 39: // right
                                    if (!this.keyboardNavigation) break;
                                    dir = e.keyCode == 37 ? -1 : 1;
                                    viewMode = this.viewMode;
                                    if (e.ctrlKey) {
                                        viewMode += 2;
                                    } else if (e.shiftKey) {
                                        viewMode += 1;
                                    }
                                    if (viewMode == 4) {
                                        newDate = this.moveYear(this.date, dir);
                                        newViewDate = this.moveYear(this.viewDate, dir);
                                    } else if (viewMode == 3) {
                                        newDate = this.moveMonth(this.date, dir);
                                        newViewDate = this.moveMonth(this.viewDate, dir);
                                    } else if (viewMode == 2) {
                                        newDate = this.moveDate(this.date, dir);
                                        newViewDate = this.moveDate(this.viewDate, dir);
                                    } else if (viewMode == 1) {
                                        newDate = this.moveHour(this.date, dir);
                                        newViewDate = this.moveHour(this.viewDate, dir);
                                    } else if (viewMode == 0) {
                                        newDate = this.moveMinute(this.date, dir);
                                        newViewDate = this.moveMinute(this.viewDate, dir);
                                    }
                                    if (this.dateWithinRange(newDate)) {
                                        this.date = newDate;
                                        this.viewDate = newViewDate;
                                        this.setValue();
                                        this.update();
                                        e.preventDefault();
                                        dateChanged = true;
                                    }
                                    break;
                                case 38: // up
                                case 40: // down
                                    if (!this.keyboardNavigation) break;
                                    dir = e.keyCode == 38 ? -1 : 1;
                                    viewMode = this.viewMode;
                                    if (e.ctrlKey) {
                                        viewMode += 2;
                                    } else if (e.shiftKey) {
                                        viewMode += 1;
                                    }
                                    if (viewMode == 4) {
                                        newDate = this.moveYear(this.date, dir);
                                        newViewDate = this.moveYear(this.viewDate, dir);
                                    } else if (viewMode == 3) {
                                        newDate = this.moveMonth(this.date, dir);
                                        newViewDate = this.moveMonth(this.viewDate, dir);
                                    } else if (viewMode == 2) {
                                        newDate = this.moveDate(this.date, dir * 7);
                                        newViewDate = this.moveDate(this.viewDate, dir * 7);
                                    } else if (viewMode == 1) {
                                        if (this.showMeridian) {
                                            newDate = this.moveHour(this.date, dir * 6);
                                            newViewDate = this.moveHour(this.viewDate, dir * 6);
                                        } else {
                                            newDate = this.moveHour(this.date, dir * 4);
                                            newViewDate = this.moveHour(this.viewDate, dir * 4);
                                        }
                                    } else if (viewMode == 0) {
                                        newDate = this.moveMinute(this.date, dir * 4);
                                        newViewDate = this.moveMinute(this.viewDate, dir * 4);
                                    }
                                    if (this.dateWithinRange(newDate)) {
                                        this.date = newDate;
                                        this.viewDate = newViewDate;
                                        this.setValue();
                                        this.update();
                                        e.preventDefault();
                                        dateChanged = true;
                                    }
                                    break;
                                case 13: // enter
                                    if (this.viewMode != 0) {
                                        var oldViewMode = this.viewMode;
                                        this.showMode(-1);
                                        this.fill();
                                        if (oldViewMode == this.viewMode && this.autoclose) {
                                            this.hide();
                                        }
                                    } else {
                                        this.fill();
                                        if (this.autoclose) {
                                            this.hide();
                                        }
                                    }
                                    e.preventDefault();
                                    break;
                                case 9: // tab
                                    this.hide();
                                    break;
                            }
                            if (dateChanged) {
                                var element;
                                if (this.isInput) {
                                    element = this.element;
                                } else if (this.component) {
                                    element = this.element.find('input');
                                }
                                if (element) {
                                    element.change();
                                }
                                this.element.trigger({
                                    type: 'changeDate',
                                    date: this.date
                                });
                            }
                        },

                        showMode: function (dir) {
                            if (dir) {
                                var newViewMode = Math.max(0, Math.min(DPGlobal.modes.length - 1, this.viewMode + dir));
                                if (newViewMode >= this.minView && newViewMode <= this.maxView) {
                                    this.viewMode = newViewMode;
                                }
                            }
                            /*
                             vitalets: fixing bug of very special conditions:
                             jquery 1.7.1 + webkit + show inline datetimepicker in bootstrap popover.
                             Method show() does not set display css correctly and datetimepicker is not shown.
                             Changed to .css('display', 'block') solve the problem.
                             See https://github.com/vitalets/x-editable/issues/37

                             In jquery 1.7.2+ everything works fine.
                             */
                            //this.picker.find('>div').hide().filter('.calendar-'+DPGlobal.modes[this.viewMode].clsName).show();
                            this.picker.find('>div').hide().filter('.calendar-' + DPGlobal.modes[this.viewMode].clsName).css('display', 'block');
                            this.updateNavArrows();
                        },

                        reset: function (e) {
                            this._setDate(null, 'date');
                        }
                    };

                    var uidatetimepicker = function (option) {

                        return element.each(function () {
                            var $this = element,
                                data = $this.data('calendar'),
                                options = typeof option == 'object' && option;
                            if (!data) {
                                $this.data('calendar', (data = new Datetimepicker(this, $.extend({}, uidatetimepicker.defaults, options))));
                            }

                        });
                    };
                    scope.$on('$destroy', function() {
                             var $this = element,
                                 data = $this.data('calendar');
                             if (data) {
                                 data.picker.remove();
                             }
					});
                    uidatetimepicker.defaults = {
                    };
                    uidatetimepicker.Constructor = Datetimepicker;
                    var dates = uidatetimepicker.dates = {
                        en: {
                            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                            daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                            daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
                            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                            meridiem: ["am", "pm"],
                            suffix: ["st", "nd", "rd", "th"],
                            today: "Today"
                        },
                        zh_CN: {
                            days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
                            daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                            daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
                            months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                            monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                            today: "现在时间",
                            meridiem: ["上午", "下午"],
                            suffix: []
                        }
                    };

                    var DPGlobal = {
                        modes: [
                            {
                                clsName: 'minutes',
                                navFnc: 'Hours',
                                navStep: 1
                            },
                            {
                                clsName: 'hours',
                                navFnc: 'Date',
                                navStep: 1
                            },
                            {
                                clsName: 'days',
                                navFnc: 'Month',
                                navStep: 1
                            },
                            {
                                clsName: 'months',
                                navFnc: 'FullYear',
                                navStep: 1
                            },
                            {
                                clsName: 'years',
                                navFnc: 'FullYear',
                                navStep: 10
                            }
                        ],
                        isLeapYear: function (year) {
                            return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
                        },
                        getDaysInMonth: function (year, month) {
                            return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
                        },
                        getDefaultFormat: function (type, field) {
                            if (type == "standard") {
                                if (field == 'input')
                                    return 'yyyy-mm-dd hh:ii';
                                else
                                    return 'yyyy-mm-dd hh:ii:ss';
                            } else if (type == "php") {
                                if (field == 'input')
                                    return 'Y-m-d H:i';
                                else
                                    return 'Y-m-d H:i:s';
                            } else {
                                throw new Error("Invalid format type.");
                            }
                        },
                        validParts: function (type) {
                            if (type == "standard") {
                                return /hh?|HH?|p|P|ii?|ss?|dd?|DD?|mm?|MM?|yy(?:yy)?/g;
                            } else if (type == "php") {
                                return /[dDjlNwzFmMnStyYaABgGhHis]/g;
                            } else {
                                throw new Error("Invalid format type.");
                            }
                        },
                        nonpunctuation: /[^ -\/:-@\[-`{-~\t\n\rTZ]+/g,
                        parseFormat: function (format, type) {
                            // IE treats \0 as a string end in inputs (truncating the value),
                            // so it's a bad format delimiter, anyway
                            var separators = format.replace(this.validParts(type), '\0').split('\0'),
                                parts = format.match(this.validParts(type));
                            if (!separators || !separators.length || !parts || parts.length == 0) {
                                throw new Error("Invalid date format.");
                            }
                            return {separators: separators, parts: parts};
                        },
                        parseDate: function (date, format, language, type) {
                            if (date instanceof Date) {
                                var dateUTC = new Date(date.valueOf() - date.getTimezoneOffset() * 60000);
                                dateUTC.setMilliseconds(0);
                                return dateUTC;
                            }
                            if (/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(date)) {
                                format = this.parseFormat('yyyy-mm-dd', type);
                            }
                            if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}$/.test(date)) {
                                format = this.parseFormat('yyyy-mm-dd hh:ii', type);
                            }
                            if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}\:\d{1,2}[Z]{0,1}$/.test(date)) {
                                format = this.parseFormat('yyyy-mm-dd hh:ii:ss', type);
                            }
                            if (/^[-+]\d+[dmwy]([\s,]+[-+]\d+[dmwy])*$/.test(date)) {
                                var part_re = /([-+]\d+)([dmwy])/,
                                    parts = date.match(/([-+]\d+)([dmwy])/g),
                                    part, dir;
                                date = new Date();
                                for (var i = 0; i < parts.length; i++) {
                                    part = part_re.exec(parts[i]);
                                    dir = parseInt(part[1]);
                                    switch (part[2]) {
                                        case 'd':
                                            date.setUTCDate(date.getUTCDate() + dir);
                                            break;
                                        case 'm':
                                            date = Datetimepicker.prototype.moveMonth.call(Datetimepicker.prototype, date, dir);
                                            break;
                                        case 'w':
                                            date.setUTCDate(date.getUTCDate() + dir * 7);
                                            break;
                                        case 'y':
                                            date = Datetimepicker.prototype.moveYear.call(Datetimepicker.prototype, date, dir);
                                            break;
                                    }
                                }
                                return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), 0);
                            }
                            var parts = date && date.match(this.nonpunctuation) || [],
                                date = new Date(0, 0, 0, 0, 0, 0, 0),
                                parsed = {},
                                setters_order = ['hh', 'h', 'ii', 'i', 'ss', 's', 'yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'D', 'DD', 'd', 'dd', 'H', 'HH', 'p', 'P'],
                                setters_map = {
                                    hh: function (d, v) {
                                        return d.setUTCHours(v);
                                    },
                                    h: function (d, v) {
                                        return d.setUTCHours(v);
                                    },
                                    HH: function (d, v) {
                                        return d.setUTCHours(v == 12 ? 0 : v);
                                    },
                                    H: function (d, v) {
                                        return d.setUTCHours(v == 12 ? 0 : v);
                                    },
                                    ii: function (d, v) {
                                        return d.setUTCMinutes(v);
                                    },
                                    i: function (d, v) {
                                        return d.setUTCMinutes(v);
                                    },
                                    ss: function (d, v) {
                                        return d.setUTCSeconds(v);
                                    },
                                    s: function (d, v) {
                                        return d.setUTCSeconds(v);
                                    },
                                    yyyy: function (d, v) {
                                        return d.setUTCFullYear(v);
                                    },
                                    yy: function (d, v) {
                                        return d.setUTCFullYear(2000 + v);
                                    },
                                    m: function (d, v) {
                                        v -= 1;
                                        while (v < 0) v += 12;
                                        v %= 12;
                                        d.setUTCMonth(v);
                                        while (d.getUTCMonth() != v)
                                            d.setUTCDate(d.getUTCDate() - 1);
                                        return d;
                                    },
                                    d: function (d, v) {
                                        return d.setUTCDate(v);
                                    },
                                    p: function (d, v) {
                                        return d.setUTCHours(v == 1 ? d.getUTCHours() + 12 : d.getUTCHours());
                                    }
                                },
                                val, filtered, part;
                            setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
                            setters_map['dd'] = setters_map['d'];
                            setters_map['P'] = setters_map['p'];
							date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
 							if (parts.length == format.parts.length) {
                                for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
                                    val = parseInt(parts[i], 10);
                                    part = format.parts[i];
                                    if (isNaN(val)) {
                                        switch (part) {
                                            case 'MM':
                                                filtered = vx.element(dates[language].months).filter(function () {
                                                    var m = this.slice(0, parts[i].length),
                                                        p = parts[i].slice(0, m.length);
                                                    return m == p;
                                                });
                                                val = $.inArray(filtered[0], dates[language].months) + 1;
                                                break;
                                            case 'M':
                                                filtered = vx.element(dates[language].monthsShort).filter(function () {
                                                    var m = this.slice(0, parts[i].length),
                                                        p = parts[i].slice(0, m.length);
                                                    return m == p;
                                                });
                                                val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
                                                break;
                                            case 'p':
                                            case 'P':
                                                val = $.inArray(parts[i].toLowerCase(), dates[language].meridiem);
                                                break;
                                        }
                                    }
                                    parsed[part] = val;
                                }
                                for (var i = 0, s; i < setters_order.length; i++) {
                                    s = setters_order[i];
                                    if (s in parsed && !isNaN(parsed[s])){
                                        setters_map[s](date, parsed[s]);
                                    }else if(s in parsed && isNaN(parsed[s])){
                                    	if(s=="yyyy"){
                                    		setters_map[s](date,new Date().getFullYear());
                                    	}else if(s=="mm"){
                                    		setters_map[s](date,new Date().getMonth()+1);
                                    	}else if(s=="dd"){
                                    	 setters_map[s](date,new Date().getDate());
                                    	 }else {}
                                    }
                                }
                            }else{
                            	date = new Date();
                            }

                            return date;
                        },
                        formatDate: function (date, format, language, type) {
                            if (date == null) {
                                return '';
                            }
                            var val;
                            if (type == 'standard') {
                                val = {
                                    // year
                                    yy: date.getUTCFullYear().toString().substring(2),
                                    yyyy: date.getUTCFullYear(),
                                    // month
                                    m: date.getUTCMonth() + 1,
                                    M: dates[language].monthsShort[date.getUTCMonth()],
                                    MM: dates[language].months[date.getUTCMonth()],
                                    // day
                                    d: date.getUTCDate(),
                                    D: dates[language].daysShort[date.getUTCDay()],
                                    DD: dates[language].days[date.getUTCDay()],
                                    p: (dates[language].meridiem.length == 2 ? dates[language].meridiem[date.getUTCHours() < 12 ? 0 : 1] : ''),
                                    // hour
                                    h: date.getUTCHours(),
                                    // minute
                                    i: date.getUTCMinutes(),
                                    // second
                                    s: date.getUTCSeconds()
                                };
                                val.H = (val.h % 12 == 0 ? 12 : val.h % 12);
                                val.HH = (val.H < 10 ? '0' : '') + val.H;
                                val.P = val.p.toUpperCase();
                                val.hh = (val.h < 10 ? '0' : '') + val.h;
                                val.ii = (val.i < 10 ? '0' : '') + val.i;
                                val.ss = (val.s < 10 ? '0' : '') + val.s;
                                val.dd = (val.d < 10 ? '0' : '') + val.d;
                                val.mm = (val.m < 10 ? '0' : '') + val.m;
                            } else if (type == 'php') {
                                // php format
                                val = {
                                    // year
                                    y: date.getUTCFullYear().toString().substring(2),
                                    Y: date.getUTCFullYear(),
                                    // month
                                    F: dates[language].months[date.getUTCMonth()],
                                    M: dates[language].monthsShort[date.getUTCMonth()],
                                    n: date.getUTCMonth() + 1,
                                    t: DPGlobal.getDaysInMonth(date.getUTCFullYear(), date.getUTCMonth()),
                                    // day
                                    j: date.getUTCDate(),
                                    l: dates[language].days[date.getUTCDay()],
                                    D: dates[language].daysShort[date.getUTCDay()],
                                    w: date.getUTCDay(), // 0 -> 6
                                    N: (date.getUTCDay() == 0 ? 7 : date.getUTCDay()),       // 1 -> 7
                                    S: (date.getUTCDate() % 10 <= dates[language].suffix.length ? dates[language].suffix[date.getUTCDate() % 10 - 1] : ''),
                                    // hour
                                    a: (dates[language].meridiem.length == 2 ? dates[language].meridiem[date.getUTCHours() < 12 ? 0 : 1] : ''),
                                    g: (date.getUTCHours() % 12 == 0 ? 12 : date.getUTCHours() % 12),
                                    G: date.getUTCHours(),
                                    // minute
                                    i: date.getUTCMinutes(),
                                    // second
                                    s: date.getUTCSeconds()
                                };
                                val.m = (val.n < 10 ? '0' : '') + val.n;
                                val.d = (val.j < 10 ? '0' : '') + val.j;
                                val.A = val.a.toString().toUpperCase();
                                val.h = (val.g < 10 ? '0' : '') + val.g;
                                val.H = (val.G < 10 ? '0' : '') + val.G;
                                val.i = (val.i < 10 ? '0' : '') + val.i;
                                val.s = (val.s < 10 ? '0' : '') + val.s;
                            } else {
                                throw new Error("Invalid format type.");
                            }
                            var date = [],
                                seps = $.extend([], format.separators);
                            for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
                                if (seps.length)
                                    date.push(seps.shift())
                                date.push(val[format.parts[i]]);
                            }
                            return date.join('');
                        },
                        convertViewMode: function (viewMode) {
                            switch (viewMode) {
                                case 4:
                                case 'decade':
                                    viewMode = 4;
                                    break;
                                case 3:
                                case 'year':
                                    viewMode = 3;
                                    break;
                                case 2:
                                case 'month':
                                    viewMode = 2;
                                    break;
                                case 1:
                                case 'day':
                                    viewMode = 1;
                                    break;
                                case 0:
                                case 'hour':
                                    viewMode = 0;
                                    break;
                            }

                            return viewMode;
                        },
                        headTemplate: '<thead>' +
                            '<tr>' +
                            '<th class="prev"><i class="icon-arrow-left"/></th>' +
                            '<th colspan="5" class="switch"></th>' +
                            '<th class="next"><i class="icon-arrow-right"/></th>' +
                            '</tr>' +
                            '</thead>',
                        contTemplate: '<tbody><tr><td colspan="7" class="tdw"></td></tr></tbody>',
                        footTemplate: '<tfoot><tr><th colspan="7" class="today"></th></tr></tfoot>',
                        iframeTemplate:'<IFRAME style="DISPLAY: none; Z-INDEX: 1; FILTER: progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0);  POSITION: absolute;" src="javascript:\'<html></html>\';" frameBorder=0 scrolling=no  tabindex ="-1"></IFRAME> '
                    };
                    DPGlobal.template = '<div class="calendar">' +
                        '<div class="calendar-minutes">' +
                        '<table class=" table-condensed">' +
                        DPGlobal.headTemplate +
                        DPGlobal.contTemplate +
                        DPGlobal.footTemplate +
                        '</table>' +
                        '</div>' +
                        '<div class="calendar-hours">' +
                        '<table class=" table-condensed">' +
                        DPGlobal.headTemplate +
                        DPGlobal.contTemplate +
                        DPGlobal.footTemplate +
                        '</table>' +
                        '</div>' +
                        '<div class="calendar-days">' +
                        '<table class=" table-condensed">' +
                        DPGlobal.headTemplate +
                        '<tbody></tbody>' +
                        DPGlobal.footTemplate +
                        '</table>' +
                        '</div>' +
                        '<div class="calendar-months">' +
                        '<table class="table-condensed">' +
                        DPGlobal.headTemplate +
                        DPGlobal.contTemplate +
                        DPGlobal.footTemplate +
                        '</table>' +
                        '</div>' +
                        '<div class="calendar-years">' +
                        '<table class="table-condensed">' +
                        DPGlobal.headTemplate +
                        DPGlobal.contTemplate +
                        DPGlobal.footTemplate +
                        '</table>' +
                        '</div>' +
                        '</div>';
                    //fix ie select box bug that cover over this component ---xwx
                  	if(/msie/.test(navigator.userAgent.toLowerCase()) && $.browser.version == "6.0")

                    	DPGlobal.template = DPGlobal.iframeTemplate + DPGlobal.template;
                  	uidatetimepicker.DPGlobal = DPGlobal;

					uidatetimepicker(options);
                }
            };
        }];

	vx.module('ui.libraries').directive(directive);

})(window, window.vx);
