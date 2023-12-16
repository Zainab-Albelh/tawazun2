HijriDate.moonCycle = 29.5305882;
//HijriDate.constInterval = -42521695200000; // -42521587200000;
HijriDate.constInterval = ((492149 * 24 * 60 * 60) * -1000 ) + 1; //Increment First Number

// value of time interval in milliseconds
// from July 18, 622AD 06:00 PM to January 1, 1970AD, 00:00 AM
HijriDate.monthNames = ["محرم", "صفر", "ربيع الاول", "ربيع الثاني", "جمادي الاول", "جمادي الثاني", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"];
HijriDate.monthShortNames = ["محرم", "صفر", "ربيع الاول", "ربيع الثاني", "جمادي الاول", "جمادي الثاني", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"];
HijriDate.weekdayNames = ['الاحد', 'الاثنين', 'الثلاثاء', 'الاربعاء', 'الخميس', 'الجمعة', 'السبت'];
HijriDate.weekdayShortNames = ['الاحد', 'الاثنين', 'الثلاثاء', 'الاربعاء', 'الخميس', 'الجمعة', 'السبت'];
HijriDate.toDigit = function(num, digit){
	var ns = num.toString();
	if (ns.length > digit) return ns;
	return ('00000000' + ns).slice(-digit);
}
HijriDate.daysInMonth = function(month){
	return (month >= 0) ? HijriDate.daysCount(month + 1) - HijriDate.daysCount(month) : HijriDate.daysCount(month) - HijriDate.daysCount(month + 1);
}
HijriDate.daysCount = function(month){
	if (month >= 0) return parseInt(month * HijriDate.moonCycle);
	var times = (parseInt(-month / 30601) + 1) * 30601;
	return parseInt(times * HijriDate.moonCycle) - parseInt((times + month) * HijriDate.moonCycle);
}
HijriDate.parseInt = function(num, def){
	var res = parseInt(num);
	return isNaN(res) ? def : res;
}
Date.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
Date.monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
Date.weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
Date.weekdayShortNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
Date.javaWeekdayNames = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
Date.prototype.getHijriDate = function(){
	return new HijriDate(this.getTime());
};
Date.prototype.getDaysInMonth = function(){
	var y = this.getFullYear(),
		isLeapYear = (y % 100 !== 0) && (y % 4 === 0) || (y % 400 === 0),
		daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	return daysInMonth[this.getMonth()];
};
Date.prototype.getMonthName = function(month){
	return Date.monthNames[(month === undefined) ? this.getMonth() : parseInt(month)];
};
Date.prototype.getMonthShortName = function(month){
	return Date.monthShortNames[(month === undefined) ? this.getMonth() : parseInt(month)];
};
Date.prototype.getDayName = function(day){
	return Date.weekdayNames[(day === undefined) ? this.getDay() : parseInt(day)];
};
Date.prototype.getDayShortName = function(day){
	return Date.weekdayShortNames[(day === undefined) ? this.getDay() : parseInt(day)];
};
Date.prototype.getJavaWeekday = function(){
	var day = (this.getTime() - this.getTimezoneOffset() * 6e4) / 864e5;
	day = Math.floor(day);
	day = (day + 3) % 5;
	return (day < 0) ? day + 5 : day;
};
Date.prototype.getJavaWeekdayName = function(day){
	return Date.javaWeekdayNames[(day === undefined) ? this.getJavaWeekday() : parseInt(day)];
};
Date.prototype.getFullYearString = function(){
	var y = this.getFullYear();
	return (y > 0) ? HijriDate.toDigit(y, 4) + " م" : HijriDate.toDigit(Math.abs(y - 1), 4) + " ق.م";
};
Date.prototype.getCustomFormatted = function(){
	const day = this.getDate();
	const month = this.getMonth() + 1;
	const year = this.getFullYear();
	return `${month}/${day}/${year}`;
};
Date.prototype.getDateString = function(){
	return this.getDayName() + ', ' + this.getMonthName() + ' ' + this.getDate() + ', ' + this.getFullYearString();
};
Date.prototype.getTimeString = function(){
	return HijriDate.toDigit(this.getHours(), 2) + ':' + HijriDate.toDigit(this.getMinutes(), 2) + ':' + HijriDate.toDigit(this.getSeconds(), 2) + '.' + HijriDate.toDigit(this.getMilliseconds(), 3);
};
Date.prototype.getFullDateString = function(){
	return this.getDateString() + ' ' + this.getTimeString();
};
function Calendar(isHijriMode, firstDayOfWeek, isAutoHide, isAutoSelectedDate, year, month, date){
	if (typeof HijriDate === 'undefined') throw new Error('HijriDate() Class is Required!');
	isHijriMode = !!isHijriMode;
	firstDayOfWeek = (firstDayOfWeek === undefined) ? 1 : ~~firstDayOfWeek;
	isAutoHide = (isAutoHide === undefined) ? true : !!isAutoHide;
	isAutoSelectedDate = !!isAutoSelectedDate;
	var self = this,
		thisDate = isHijriMode ? new HijriDate() : new Date(),
		selectedDate = isHijriMode ? new HijriDate() : new Date(),
		currentYear = thisDate.getFullYear(),
		currentMonth = thisDate.getMonth(),
		currentDate = thisDate.getDate(),
		isHidden = true,
		isSettingsHidden = true,
		isExtraButtonsVisible = false,
		isDisableCallback = false,
		displayStyle = 'block',
		hasEventListeners = !!window.addEventListener,
		calendarElement = document.createElement('div'),
		prevMonthElement = document.createElement('div'),
		monthElement = document.createElement('select'),
		nextMonthElement = document.createElement('div'),
		dec100YearElement = document.createElement('div'),
		dec10YearElement = document.createElement('div'),
		prevYearElement = document.createElement('div'),
		yearElement = document.createElement('input'),
		nextYearElement = document.createElement('div'),
		inc10YearElement = document.createElement('div'),
		inc100YearElement = document.createElement('div'),
		showSettingsElement = document.createElement('div'),
		settingsRowElement = document.createElement('div'),
		changeDateModeElement = document.createElement('div'),
		changeFirstDayOfWeekElement = document.createElement('div'),
		changeAutoHideElement = document.createElement('div'),
		changeAutoSelectedDateElement = document.createElement('div'),
		changeExtraButtonsVisibilityElement = document.createElement('div'),
		hideSettingsElement = document.createElement('div'),
		hideCalendarElement = document.createElement('div'),
		weekdayRowElement = document.createElement('div'),
		dateGridElement = document.createElement('div'),
		setCalendarDisplay = function(){
			calendarElement.style.display = isHidden ? 'none' : displayStyle;
		},
		setShowSettingsAppearance = function(){
			settingsRowElement.style.display = isSettingsHidden ? 'none' : '';
			showSettingsElement.title = (isSettingsHidden ? 'Show' : 'Hide');
			Calendar.markElement(showSettingsElement, !isSettingsHidden);
		},
		setDateModeAppearance = function(){
			changeDateModeElement.title = 'Change to ' + (isHijriMode ? 'Gregorian' : 'Hijri');
			Calendar.markElement(changeDateModeElement, isHijriMode);
		},
		setFirstDayOfWeekAppearance = function(){
			changeFirstDayOfWeekElement.title = 'Set ' + thisDate.getDayName(firstDayOfWeek ^ 1);
			Calendar.markElement(changeFirstDayOfWeekElement, !!firstDayOfWeek);
		},
		setAutoHideAppearance = function(){
			changeAutoHideElement.title = (isAutoHide ? 'Disable' : 'Enable');
			Calendar.markElement(changeAutoHideElement, isAutoHide);
			if (isAutoHide && isAutoSelectedDate){
				isAutoSelectedDate = false;
				setAutoSelectedDateAppearance();
			}
			Calendar.disableElement(changeAutoSelectedDateElement, isAutoHide);
		},
		setAutoSelectedDateAppearance = function(){
			changeAutoSelectedDateElement.title = (isAutoSelectedDate ? 'Disable' : 'Enable');
			Calendar.markElement(changeAutoSelectedDateElement, isAutoSelectedDate);
		},
		setExtraButtonsVisibilityAppearance = function(){
			changeExtraButtonsVisibilityElement.title = (isExtraButtonsVisible ? 'Hide' : 'Show');
			Calendar.markElement(changeExtraButtonsVisibilityElement, isExtraButtonsVisible);
			Calendar.revealElement(dec100YearElement, isExtraButtonsVisible);
			Calendar.revealElement(dec10YearElement, isExtraButtonsVisible);
			Calendar.revealElement(inc10YearElement, isExtraButtonsVisible);
			Calendar.revealElement(inc100YearElement, isExtraButtonsVisible);
		},
		setDateParams = function(setYear, setMonth, setDate){
			setYear = Calendar.parseInt(setYear, 1);
			setMonth = Calendar.parseInt(setMonth, 0);
			setDate = Calendar.parseInt(setDate, 1);
			selectedDate.setFullYear(setYear);
			selectedDate.setMonth(setMonth);
			selectedDate.setDate(setDate);
			thisDate.setTime(selectedDate.getTime());
			thisDate.setDate(1);
		},
		createCalendar = function(){
			var header = document.createElement('div');
			calendarElement.classList.add('calendar');
			header.classList.add('header-row');
			prevMonthElement.classList.add('header-button');
			monthElement.classList.add('month-field');
			nextMonthElement.classList.add('header-button');
			dec100YearElement.classList.add('header-button');
			dec10YearElement.classList.add('header-button');
			prevYearElement.classList.add('header-button');
			yearElement.classList.add('year-field');
			yearElement.setAttribute('type', 'text');
			nextYearElement.classList.add('header-button');
			inc10YearElement.classList.add('header-button');
			inc100YearElement.classList.add('header-button');
			showSettingsElement.classList.add('header-button');
			settingsRowElement.classList.add('setting-row');
			changeDateModeElement.classList.add('setting-button');
			changeFirstDayOfWeekElement.classList.add('setting-button');
			changeAutoHideElement.classList.add('setting-button');
			changeAutoSelectedDateElement.classList.add('setting-button');
			changeExtraButtonsVisibilityElement.classList.add('setting-button');
			hideSettingsElement.classList.add('setting-button');
			hideCalendarElement.classList.add('setting-button');
			weekdayRowElement.classList.add('weekday-row');
			dateGridElement.classList.add('date-grid');
			prevMonthElement.innerHTML = '<div class=pika-hijri-prev></div>';
			prevMonthElement.title = '';
			nextMonthElement.innerHTML = '<div class=pika-hijri-next></div>';
			nextMonthElement.title = '';
			dec100YearElement.innerHTML = '«';
			dec100YearElement.title = '';
			dec10YearElement.innerHTML = '‹';
			dec10YearElement.title = '';
			prevYearElement.innerHTML = '<div class=pika-hijri-prev></div>';
			prevYearElement.title = '';
			nextYearElement.innerHTML = '<div class=pika-hijri-next></div>';
			nextYearElement.title = '';
			inc10YearElement.innerHTML = '›';
			inc10YearElement.title = '';
			inc100YearElement.innerHTML = '»';
			inc100YearElement.title = '';
			showSettingsElement.innerHTML = '\u2699';
			changeDateModeElement.innerHTML = '\u262a';
			changeFirstDayOfWeekElement.innerHTML = '\u2693';
			changeAutoHideElement.innerHTML = '\u2690';
			changeAutoSelectedDateElement.innerHTML = '\u26cf';
			changeExtraButtonsVisibilityElement.innerHTML = '«»';
			hideSettingsElement.innerHTML = '\u2714';
			hideSettingsElement.title = 'Hide menu settings bar';
			hideCalendarElement.innerHTML = '\u2715';
			hideCalendarElement.title = 'Hide calendar';
			setShowSettingsAppearance();
			setDateModeAppearance();
			setFirstDayOfWeekAppearance();
			setAutoSelectedDateAppearance();
			setAutoHideAppearance();
			setExtraButtonsVisibilityAppearance();
			setCalendarDisplay();
			addEvent(prevMonthElement, 'click', onDecrementMonth);
			addEvent(monthElement, 'change', onChangeMonth);
			addEvent(nextMonthElement, 'click', onIncrementMonth);
			addEvent(dec100YearElement, 'click', onDecrement100Year);
			addEvent(dec10YearElement, 'click', onDecrement10Year);
			addEvent(prevYearElement, 'click', onDecrementYear);
			addEvent(yearElement, 'change', onChangeYear);
			addEvent(nextYearElement, 'click', onIncrementYear);
			addEvent(inc10YearElement, 'click', onIncrement10Year);
			addEvent(inc100YearElement, 'click', onIncrement100Year);
			addEvent(showSettingsElement, 'click', onChangeSettingsShow);
			addEvent(changeDateModeElement, 'click', onChangeDateMode);
			addEvent(changeFirstDayOfWeekElement, 'click', onChangeFirstDayOfWeek);
			addEvent(changeAutoHideElement, 'click', onChangeAutoHide);
			addEvent(changeAutoSelectedDateElement, 'click', onChangeAutoSelectedDate);
			addEvent(changeExtraButtonsVisibilityElement, 'click', onChangeExtraButtonsVisibility),
				addEvent(hideSettingsElement, 'click', onChangeSettingsShow);
			addEvent(hideCalendarElement, 'click', onHideCalendar);
			for (var i = 0; i < 12; i++){
				var opt = document.createElement('option');
				opt.value = i;
				opt.text = thisDate.getMonthName(i);
				monthElement.appendChild(opt);
			}
			header.appendChild(prevMonthElement);
			header.appendChild(monthElement);
			header.appendChild(nextMonthElement);
			header.appendChild(dec100YearElement);
			header.appendChild(dec10YearElement);
			header.appendChild(prevYearElement);
			header.appendChild(yearElement);
			header.appendChild(nextYearElement);
			header.appendChild(inc10YearElement);
			header.appendChild(inc100YearElement);
			header.appendChild(showSettingsElement);
			settingsRowElement.appendChild(changeDateModeElement);
			settingsRowElement.appendChild(changeFirstDayOfWeekElement);
			settingsRowElement.appendChild(changeAutoHideElement);
			settingsRowElement.appendChild(changeAutoSelectedDateElement);
			settingsRowElement.appendChild(changeExtraButtonsVisibilityElement);
			settingsRowElement.appendChild(hideSettingsElement);
			settingsRowElement.appendChild(hideCalendarElement);
			createWeekdayRow();
			calendarElement.appendChild(header);
			calendarElement.appendChild(settingsRowElement);
			calendarElement.appendChild(weekdayRowElement);
			calendarElement.appendChild(dateGridElement);
			createDateGrid();
		},
		changeCalendarMode = function(){
			for (var i = 0; i < 12; i++) monthElement.options[i].text = thisDate.getMonthName(i);
			recreateWeekdayRow();
		},
		recreateWeekdayRow = function(){
			while (weekdayRowElement.firstChild) weekdayRowElement.removeChild(weekdayRowElement.firstChild);
			createWeekdayRow();
			recreateDateGrid();
		},
		createWeekdayRow = function(){
			for (var i = 0; i < 7; i++){
				var day = document.createElement('div'),
					wd = (i + firstDayOfWeek) % 7,
					cl = wd === 5 ? 'friday-date' : wd === 0 ? 'sunday-date' : 'normal-date';
				day.innerHTML = thisDate.getDayShortName(wd);
				day.classList.add(cl);
				weekdayRowElement.appendChild(day);
			}
		},
		recreateDateGrid = function(){
			while (dateGridElement.firstChild) dateGridElement.removeChild(dateGridElement.firstChild);
			createDateGrid();
			scrollToFix();
		},
		createDateGrid = function(){
			monthElement.selectedIndex = thisDate.getMonth();
			yearElement.value = thisDate.getFullYear();
			var cdim = thisDate.getDaysInMonth();
			thisDate.setMonth(thisDate.getMonth() - 1);
			var pdim = thisDate.getDaysInMonth();
			thisDate.setMonth(thisDate.getMonth() + 1);
			var fdim = thisDate.getDay(),
				pxd = fdim - firstDayOfWeek;
			if (pxd < 0) pxd += 7;
			var nxd = (pxd + cdim) % 7;
			if (nxd > 0) nxd = 7 - nxd;
			for (var i = pdim - pxd + 1; i <= pdim; i++){
				var de = document.createElement('div');
				de.classList.add('excluded-date');
				de.innerHTML = i;
				dateGridElement.appendChild(de);
			}
			var wd, sd;
			for (var i = 1; i <= cdim; i++){
				var de = document.createElement('div');
				de.innerHTML = i;
				wd = (fdim + i - 1) % 7;
				de.classList.add('normal-date')
				if (wd === 5) de.classList.add('friday-date');
				if (wd === 0) de.classList.add('sunday-date');
				if (thisDate.getFullYear() === currentYear && thisDate.getMonth() === currentMonth && i === currentDate) de.classList.add('current-date');
				if (thisDate.getFullYear() === selectedDate.getFullYear() && thisDate.getMonth() === selectedDate.getMonth() && i === selectedDate.getDate()) de.classList.add('selected-date');
				sd = (i - 1) * 864e5 + thisDate.getTime();
				if (265860e5 <= sd && sd < 266724e5) de.classList.add('specialz-date');
				addEvent(de, 'click', onChangeDate);
				dateGridElement.appendChild(de);
			}
			for (var i = 1; i <= nxd; i++){
				var de = document.createElement('div');
				de.classList.add('excluded-date');
				de.innerHTML = i;
				dateGridElement.appendChild(de);
			}
		},
		scrollToFix = function(){
			var dw = document.body.offsetWidth,
				vw = window.innerWidth,
				vh = window.innerHeight,
				rect = calendarElement.getBoundingClientRect(),
				hsSpc = dw > vw ? 20 : 0,
				scrollX = rect.left < 0 ? rect.left : 0,
				scrollY = rect.bottom - rect.top > vh ? rect.top : rect.bottom > vh - hsSpc ? rect.bottom - vh + hsSpc : 0;
			window.scrollBy(scrollX, scrollY);
		},
		updateCalendar = function(){
			if (isAutoSelectedDate){
				var dim = thisDate.getDaysInMonth(),
					dt = selectedDate.getDate();
				selectedDate.setTime(thisDate.getTime());
				selectedDate.setDate(dt > dim ? dim : dt);
				recreateDateGrid();
				if (typeof self.callback === 'function' && !isDisableCallback) self.callback();
			} else recreateDateGrid();
		},
		hideCalendar = function(){
			self.hide();
			if (typeof self.onHide === 'function') self.onHide();
		},
		addEvent = function(elm, evt, callback){
			if (hasEventListeners) elm.addEventListener(evt, callback);
			else elm.attachEvent('on' + evt, callback);
		},
		onChangeDate = function(evt){
			evt = evt || window.event;
			var target = evt.target || evt.srcElement;
			var prevElm = dateGridElement.getElementsByClassName('selected-date')[0];
			if (target !== prevElm){
				if (!!prevElm) prevElm.classList.remove('selected-date');
				target.classList.add('selected-date');
				selectedDate.setTime(thisDate.getTime());
				selectedDate.setDate(parseInt(target.innerHTML));
			}
			if (isAutoHide) hideCalendar();
			if (typeof self.callback === 'function' && !isDisableCallback) self.callback();
			return returnEvent(evt);
		},
		onDecrementMonth = function(evt){
			evt = evt || window.event;
			thisDate.setMonth(thisDate.getMonth() - 1);
			updateCalendar();
			return returnEvent(evt);
		},
		onChangeMonth = function(){
			thisDate.setMonth(parseInt(monthElement.value));
			updateCalendar();
		},
		onIncrementMonth = function(evt){
			evt = evt || window.event;
			thisDate.setMonth(thisDate.getMonth() + 1);
			updateCalendar();
			return returnEvent(evt);
		},
		onDecrement100Year = function(evt){
			evt = evt || window.event;
			thisDate.setFullYear(thisDate.getFullYear() - 100);
			updateCalendar();
			return returnEvent(evt);
		},
		onDecrement10Year = function(evt){
			evt = evt || window.event;
			thisDate.setFullYear(thisDate.getFullYear() - 10);
			updateCalendar();
			return returnEvent(evt);
		},
		onDecrementYear = function(evt){
			evt = evt || window.event;
			thisDate.setFullYear(thisDate.getFullYear() - 1);
			updateCalendar();
			return returnEvent(evt);
		},
		onChangeYear = function(){
			var y = parseInt(yearElement.value);
			if (isNaN(y)){
				yearElement.value = thisDate.getFullYear();
				return;
			}
			if (y != thisDate.getFullYear()){
				thisDate.setFullYear(y);
				updateCalendar();
			}
		},
		onIncrementYear = function(evt){
			evt = evt || window.event;
			thisDate.setFullYear(thisDate.getFullYear() + 1);
			updateCalendar();
			return returnEvent(evt);
		},
		onIncrement10Year = function(evt){
			evt = evt || window.event;
			thisDate.setFullYear(thisDate.getFullYear() + 10);
			updateCalendar();
			return returnEvent(evt);
		},
		onIncrement100Year = function(evt){
			evt = evt || window.event;
			thisDate.setFullYear(thisDate.getFullYear() + 100);
			updateCalendar();
			return returnEvent(evt);
		},
		onChangeSettingsShow = function(evt){
			evt = evt || window.event;
			isSettingsHidden = !isSettingsHidden;
			setShowSettingsAppearance();
			scrollToFix();
			return returnEvent(evt);
		},
		onChangeDateMode = function(evt){
			evt = evt || window.event;
			self.changeDateMode();
			return returnEvent(evt);
		},
		onChangeFirstDayOfWeek = function(evt){
			evt = evt || window.event;
			self.changeFirstDayOfWeek();
			return returnEvent(evt);
		},
		onChangeAutoHide = function(evt){
			evt = evt || window.event;
			self.changeAutoHide();
			return returnEvent(evt);
		},
		onChangeAutoSelectedDate = function(evt){
			evt = evt || window.event;
			self.changeAutoSelectedDate();
			return returnEvent(evt);
		},
		onChangeExtraButtonsVisibility = function(evt){
			evt = evt || window.event;
			isExtraButtonsVisible = !isExtraButtonsVisible;
			setExtraButtonsVisibilityAppearance();
			return returnEvent(evt);
		},
		onHideCalendar = function(evt){
			evt = evt || window.event;
			hideCalendar();
			return returnEvent(evt);
		},
		returnEvent = function(evt){
			if (evt.stopPropagation) evt.stopPropagation();
			if (evt.preventDefault) evt.preventDefault();
			else {
				evt.returnValue = false;
				return false;
			}
		};
	this.setDate = function(setYear, setMonth, setDate){
		setDateParams(setYear, setMonth, setDate);
		recreateDateGrid();
	};
	this.setTime = function(time){
		selectedDate.setTime(time);
		thisDate.setTime(time);
		thisDate.setDate(1);
		recreateDateGrid();
	};
	this.changeDateMode = function(){
		isHijriMode = !isHijriMode;
		thisDate = isHijriMode ? new HijriDate() : new Date();
		currentYear = thisDate.getFullYear();
		currentMonth = thisDate.getMonth();
		currentDate = thisDate.getDate();
		thisDate.setTime(selectedDate.getTime());
		selectedDate = isHijriMode ? new HijriDate(thisDate.getTime()) : new Date(thisDate.getTime());
		thisDate.setDate(1);
		changeCalendarMode();
		setDateModeAppearance();
		setFirstDayOfWeekAppearance();
		if (typeof this.callback === 'function' && !isDisableCallback) this.callback();
	};
	this.changeFirstDayOfWeek = function(){
		firstDayOfWeek ^= 1;
		recreateWeekdayRow();
		setFirstDayOfWeekAppearance();
	};
	this.changeAutoHide = function(){
		isAutoHide = !isAutoHide;
		setAutoHideAppearance();
	};
	this.changeAutoSelectedDate = function(){
		if (isAutoHide) return;
		isAutoSelectedDate = !isAutoSelectedDate;
		setAutoSelectedDateAppearance();
	};
	this.getDate = function(){
		return selectedDate;
	};
	this.getTime = function(){
		return selectedDate.getTime();
	};
	this.isHijriMode = function(){
		return isHijriMode;
	};
	this.firstDayOfWeek = function(){
		return firstDayOfWeek;
	};
	this.isAutoHide = function(){
		return isAutoHide;
	};
	this.isAutoSelectedDate = function(){
		return isAutoSelectedDate;
	};
	this.isHidden = function(){
		return isHidden;
	};
	this.callback;
	this.onHide;
	this.disableCallback = function(state){
		isDisableCallback = !!state;
	};
	this.getElement = function(){
		return calendarElement;
	};
	this.setDisplayStyle = function(style){
		displayStyle = style;
		setCalendarDisplay();
	};
	this.show = function(){
		if (isHidden){
			isHidden = false;
			setCalendarDisplay();
			scrollToFix();
		}
	};
	this.hide = function(){
		if (!isHidden){
			if (!isSettingsHidden){
				isSettingsHidden = true;
				setShowSettingsAppearance();
			}
			isHidden = true;
			setCalendarDisplay();
		}
	};
	this.destroy = function(){
		selectedDate = null;
		thisDate = null;
		calendarElement.remove();
		self = null;
	};
	if (year !== undefined) setDateParams(year, month, date);
	else {
		thisDate.setTime(selectedDate.getTime());
		thisDate.setDate(1);
	}
	createCalendar();
}
Calendar.parseInt = function(num, def){
	var res = parseInt(num);
	return isNaN(res) ? def : res;
};
Calendar.markElement = function(target, mode){
	Calendar.addOrRemoveClass(target, mode, 'active');
};
Calendar.disableElement = function(target, mode){
	Calendar.addOrRemoveClass(target, mode, 'disabled');
};
Calendar.revealElement = function(target, mode){
	target.style.visibility = mode ? 'visible' : 'hidden';
};
Calendar.addOrRemoveClass = function(target, addFlag, className){
	if (addFlag) target.classList.add(className);
	else target.classList.remove(className);
};
function HijriDate(year, month, date, hour, minute, second, millisecond){
	var gregDate = new Date(),
		time,
		day,
		timezoneOffset = gregDate.getTimezoneOffset() * 6e4;
	if (year === undefined){
		time = gregDate.getTime() - timezoneOffset;
		updateDate();
	} else if (month === undefined){
		time = HijriDate.parseInt(year, 0) - timezoneOffset;
		updateDate();
	} else {
		year = HijriDate.parseInt(year, 1);
		month = HijriDate.parseInt(month, 0);
		date = HijriDate.parseInt(date, 1);
		hour = HijriDate.parseInt(hour, 0);
		minute = HijriDate.parseInt(minute, 0);
		second = HijriDate.parseInt(second, 0);
		millisecond = HijriDate.parseInt(millisecond, 0);
		updateTime();
	}
	this.toString = function(){
		return this.getFullDateString();
	};
	this.valueOf = function(){
		return time;
	};
	this.getDateString = function(){
		return this.getDayName() + ', ' + date + ' ' + this.getMonthName() + ' ' + this.getFullYearString();
	};
	this.getTimeString = function(){
		return HijriDate.toDigit(hour, 2) + ':' + HijriDate.toDigit(minute, 2) + ':' + HijriDate.toDigit(second, 2) + '.' + HijriDate.toDigit(millisecond, 3);
	};
	this.getFullDateString = function(){
		return this.getDateString() + ' ' + this.getTimeString();
	};
	this.getTime = function(){
		return time + timezoneOffset;
	};
	this.getFullYear = function(){
		return year;
	};
	this.getFullYearString = function(){
		return (year > 0) ? HijriDate.toDigit(year, 4) + " هـ" : HijriDate.toDigit(Math.abs(year - 1), 4) + " BH";
	};
	this.getMonth = function(){
		return month;
	};
	this.getMonthName = function(mon){
		return HijriDate.monthNames[(mon === undefined) ? month : parseInt(mon)];
	};
	this.getMonthShortName = function(mon){
		return HijriDate.monthShortNames[(mon === undefined) ? month : parseInt(mon)];
	};
	this.getDate = function(){
		return date;
	};
	this.getHours = function(){
		return hour;
	};
	this.getMinutes = function(){
		return minute;
	};
	this.getSeconds = function(){
		return second;
	};
	this.getMilliseconds = function(){
		return millisecond;
	};
	this.getDay = function(){
		return day;
	};
	this.getDayName = function(dy){
		return HijriDate.weekdayNames[(dy === undefined) ? day : parseInt(dy)];
	};
	this.getDayShortName = function(dy){
		return HijriDate.weekdayShortNames[(dy === undefined) ? day : parseInt(dy)];
	};
	this.getDaysInMonth = function(){
		return HijriDate.daysInMonth((year - 1) * 12 + month);
	};
	this.getJavaWeekday = function(){
		return this.getGregorianDate().getJavaWeekday();
	};
	this.getJavaWeekdayName = function(dy){
		return this.getGregorianDate().getJavaWeekdayName(dy);
	};
	this.getGregorianDate = function(){
		gregDate.setTime(time + timezoneOffset);
		return gregDate;
	};
	this.setTime = function(tm){
		time = parseInt(tm) - timezoneOffset;
		updateDate();
	};
	this.setFullYear = function(yr){
		year = parseInt(yr);
		updateTime();
	};
	this.setMonth = function(mon){
		month = parseInt(mon);
		updateTime();
	};
	this.setDate = function(dt){
		date = parseInt(dt);
		updateTime();
	};
	this.setHours = function(hr){
		hour = parseInt(hr);
		updateTime();
	};
	this.setMinutes = function(min){
		minute = parseInt(min);
		updateTime();
	};
	this.setSeconds = function(sec){
		second = parseInt(sec);
		updateTime();
	};
	this.setMilliseconds = function(ms){
		millisecond = parseInt(ms);
		updateTime();
	};
	function updateDate(){
		var tm = time - HijriDate.constInterval,
			range;
		month = parseInt(parseInt((tm / 864e5)) / HijriDate.moonCycle);
		month = (tm >= 0) ? month : --month;
		date = HijriDate.daysCount(month) * 864e5;
		tm = (tm >= 0) ? tm - date : date + tm;
		millisecond = tm % 1e3;
		tm = parseInt(tm / 1e3);
		second = tm % 60;
		tm = parseInt(tm / 60);
		minute = tm % 60;
		tm = parseInt(tm / 60);
		hour = tm % 24;
		tm = parseInt(tm / 24);
		date = tm;
		range = HijriDate.daysInMonth(month);
		if (date >= range){
			month++;
			date -= range;
		}
		date++;
		year = Math.floor(month / 12) + 1;
		month = (month >= 0) ? month % 12 : (month % 12 === 0) ? 0 : 12 + month % 12;
		day = Math.floor(time / 864e5);
		day = (day + 4) % 7;
		day = (day < 0) ? day + 7 : day;
	}
	function updateTime(){
		var months = (year - 1) * 12 + month;
		time = (months >= 0) ? HijriDate.daysCount(months) : -HijriDate.daysCount(months);
		time += date;
		time *= 864e5;
		time += hour * 36e5 + minute * 6e4 + second * 1e3 + millisecond - 864e5;
		time += HijriDate.constInterval;
		updateDate();
	}
}
