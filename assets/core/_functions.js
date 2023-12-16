//Show Submit Loading
function showLoadingCover(){ $("#page-loading",window.parent.document).css("display", "flex"); }
function hideLoadingCover(){ $("#page-loading",window.parent.document).fadeOut(200); }

//Toggle visibility
function toggleVisibility(control, name=null, value=null){
	var control = (control ? $(control) : $("[name^='" + name + "']"));
	var name = (name ? name : control[0].name);
	var show = false;
	
	//Visibility
	$("[visibility-control='" + name + "'][visibility-value]").hide().each(function(){
		var values = $(this).attr("visibility-value").split(',');
		if (control.attr("type")=="radio"){
			show = (control.prop("checked")==true && values.indexOf((value ? value : control.val()))!==-1);
		} else if (control.attr("type")=="checkbox"){
			show = false;
			$("[name^='" + name + "']").each(function(){
				if (values.indexOf($(this).val())!==-1 && $(this).prop("checked")==true){
					show = true;
				}
			});
		} else {
			show = (values.indexOf((value ? value : control.val()))!==-1);
		}
		if (show){
			$(this).find("[validate-mandatory]").attr("data-validation-optional", "false");
			$(this).find("[validate-optional]").attr("data-validation", $(this).find("[validate-optional]").attr("x-data-validation"));
			$(this).show();
		} else {
			$(this).find("[validate-mandatory]").attr("data-validation-optional", "true");
			$(this).find("[validate-optional]").removeAttr("data-validation");
		}
	});
	
	//Invisibility
	$("[visibility-control='" + name + "'][invisibility-value]").show();
	$("[visibility-control='" + name + "'][invisibility-value='" + (value!=null ? value : $(control).val()) + "']").hide();
}

//Scroll to Element
function scrollToView(selector,topOffset=0,block="center",speed=300){
	var scrollParent = selector.scrollParent();
	var scrollableParent = null;
	var parentIsBody = false;
	if (scrollParent.prop("tagName")=="BODY"){
		scrollableParent = $("html,body");
		parentIsBody = true;
	} else {
		scrollableParent = scrollParent;
	}
	switch (block){
		case "start":
		offsetPosition = (!parentIsBody ? scrollableParent.scrollTop() : 0) + (!parentIsBody ? $(selector).position().top : $(selector).offset().top) - topOffset;
		break;

		case "center":
		offsetPosition = (!parentIsBody ? $(selector).position().top : $(selector).offset().top) - ($(window).height()/2) + ($(selector).height() / 2) - topOffset;
		break;
		
		default:
		break;
	}
	scrollableParent.stop().animate({
		scrollTop: (offsetPosition ? offsetPosition : 0)
	}, speed);
}

//Scroll to Element By ID
function scrollToMiddle(id) {
	var elementID = "#" + id;
	$("html,body").animate({
		scrollTop: $(elementID).offset().top - ($(window).height()/2) + $(elementID).height() / 2
	}, 300);
}


//Set Cookie
function setCookie(cname,cvalue,hours){
    var d = new Date();
    d.setTime(d.getTime() + (hours*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

//Get Cookie
function getCookie(cname){
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++){
        var c = ca[i];
        while (c.charAt(0) == ' '){
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0){
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

//Quick Message Box
function messageBox(title,message,icon,color,theme="light-noborder"){
	$.alert({
		title: title,
		content: message,
		icon: icon,
		type: color,
		theme: theme
	});
}

//Quick Notification Message
function quickNotify(message,title="",theme="success",icon="",show_progress=false,url="",target=""){
	$.notify({
		icon: icon,
		title: title,
		message: message,
		url: url,
		target: target
	},{
		element: "body",
		position: null,
		type: theme,
		allow_dismiss: true,
		newest_on_top: false,
		showProgressbar: show_progress,
		placement: {
			from: "bottom",
			align: "right"
		},
		offset: 10,
		spacing: 10,
		z_index: 999999999,
		delay: 4000,
		timer: 100,
		url_target: "_blank",
		mouse_over: null,
		animate: {
			enter: "animated faster fadeInRight",
			exit: "animated faster fadeOutLeft"
		},
		onShow: null,
		onShown: null,
		onClose: null,
		onClosed: null,
		icon_type: "class",
		template: '<div data-notify="container" class="bootstrap_notification alert alert-{0}" role=alert>' +
			'<button type=button aria-hidden=true class=close data-notify=dismiss>×</button>' +
			'<div data-notify=body><span data-notify=icon></span> ' +
			'<div><span data-notify=title>{1}</span> ' +
			'<span data-notify=message>{2}</span></div></div>' +
			'<div class=progress data-notify=progressbar>' +
				'<div class="progress-bar progress-bar-{0}" role=progressbar aria-valuenow=0 aria-valuemin=0 aria-valuemax=100 style="width:0%"></div>' +
			'</div>' +
			'<a href="{3}" target="{4}" data-notify="url"></a>' +
		'</div>' 
	});
}

//Create JS Date from String
function dateFromString(string){
	var x = string.split("/"); //D-M-Y
	var day = parseInt(x[0]);
	var month = parseInt(x[1]) - 1;
	var year = parseInt(x[2]);
	return new Date(year, month, day);
}

//Months between 2 dates
function monthDiff(date1,date2) {
    var months;
    months = (date2.getFullYear() - date1.getFullYear()) * 12;
    months -= date1.getMonth();
    months += date2.getMonth();
    return months <= 0 ? 0 : months;
}

//Set Date
function createCalendar(elementId,defaultDate,minDate=null,maxDate=null,yearRange=null,container=null,showTime=false,removable=false){
	var calendarLanguageArabic = {
		notSpecified  : "غير محدد",
		time          : "الوقت",
		previousMonth : "الشهر السابق",
		nextMonth     : "الشهر التالي",
		months        : ["يناير","فبراير","مارس","إبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"],
		weekdays      : ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],
		weekdaysShort : ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],
		midnight      : "منتصف الليل",
		noon          : "ظهرا"
	};
	
	var datePickerElement = new Pikaday({
		field: document.getElementById(elementId),
		toString(date) {
			var day = date.getDate();
			var month = date.getMonth() + 1;
			var year = date.getFullYear();
			var hour = date.getHours();
			var minute = date.getMinutes();
			hour = (hour < 10 ? "0" + hour : hour);
			minute = (minute < 10 ? "0" + minute : minute);
			return `${day}/${month}/${year}` + (showTime ? ` ${hour}:${minute}` : "");
		},
		parse(dateString) {
			var split = dateString.split(" ");
			var date = split[0].split("/");
			var day = parseInt(date[0], 10);
			var month = parseInt(date[1] - 1, 10);
			var year = parseInt(date[1], 10);
			var time = (showTime ? split[1].split(":") : null);
			var hours = (time ? parseInt(time[0], 10) : null);
			var minutes = (time ? parseInt(time[1], 10) : null);
			return new Date(year, month, day, hours, minutes);
		},
		showTime: showTime,
		showMinutes: true,
		use24hour: false,
		incrementHourBy: 1,
		incrementMinuteBy: 1,
		timeLabel: calendarLanguageArabic.time,
		firstDay: 6,
		minDate: (minDate ? minDate : new Date(1900, 0, 1)),
		maxDate: (maxDate ? maxDate : new Date((new Date()).getFullYear() + 10, 11, 31)),
		yearRange: (yearRange ? yearRange : [1900,2100]),
		defaultDate: (defaultDate && defaultDate.getTime() ? defaultDate : new Date()),
		setDefaultDate: defaultDate,
		position: ($("html").attr("dir")=="rtl" ? "bottom right" : "bottom left"),
		reposition: false,
		container: container,
		i18n: calendarLanguageArabic,
		onSelect: function (){
			var textDate = datePickerElement.toString().split(" ")[0].split("/");
			if (textDate){
				datePickerGeorgian.setTime(new Date(textDate[2],textDate[1] - 1,textDate[0]).getTime());
				datePickerGeorgian.disableCallback(true); datePickerGeorgian.changeDateMode(); datePickerGeorgian.disableCallback(false);
				datePickerHijri.setTime(datePickerGeorgian.getTime());
				$("#hijri_field_"+elementId).html(datePickerHijri.getDate().getDateString());
				datePickerGeorgian.disableCallback(true); datePickerGeorgian.changeDateMode(); datePickerGeorgian.disableCallback(false);
			}
		},
	});
	if (!defaultDate || !defaultDate.getTime()){
		$("#" + elementId).val("").attr("placeholder",calendarLanguageArabic.notSpecified);
	}
	if (removable){
		$("<span class=calendar-reset>×</span>").on("click",function(){
			$("#" + elementId).val("").attr("placeholder", calendarLanguageArabic.notSpecified);
			$("#hijri_field_" + elementId).html("&nbsp;");
		}).insertAfter($("#" + elementId));
		$("#" + elementId).addClass("date-removable");
	}
	$(window).on("resize",function(){
		datePickerElement.hide();
	});
	
	//Hijri
	var empty = false;
	var defaultSetDate = datePickerElement.getDate();
	if (!defaultSetDate){
		empty = true;
		defaultSetDate = new Date();
	}

	$("#"+elementId).after("<a class=hijri_button id='hijri_picker_" + elementId + "'><i class='fas fa-moon'></i></a><div class=hijri_container id='hijri_container_" + elementId + "'></div><div class=hijri_field id='hijri_field_" + elementId + "'></div>");
	var datePickerGeorgian = new Calendar(false,0,true,true,defaultSetDate.getFullYear(),defaultSetDate.getMonth(),defaultSetDate.getDate());
	var datePickerHijri = new Calendar(true,0,true,true);
	
	if (!empty){
		datePickerHijri.setTime(defaultSetDate.getTime());
		//datePickerHijri.disableCallback(true); datePickerHijri.changeDateMode(); datePickerHijri.disableCallback(false);
		//datePickerElement.setDate(datePickerGeorgian.getDate().getCustomFormatted());
		//datePickerHijri.disableCallback(true); datePickerHijri.changeDateMode(); datePickerHijri.disableCallback(false);
		$("#hijri_field_"+elementId).html(datePickerHijri.getDate().getDateString());
	} else {
		$("#hijri_field_"+elementId).html("&nbsp;");
	}
	
	datePickerHijri.callback = function(){
		datePickerHijri.disableCallback(true); datePickerHijri.changeDateMode(); datePickerHijri.disableCallback(false);
		datePickerElement.setDate(datePickerHijri.getDate().getCustomFormatted());
		datePickerHijri.disableCallback(true); datePickerHijri.changeDateMode(); datePickerHijri.disableCallback(false);	
		$("#hijri_field_"+elementId).html(datePickerHijri.getDate().getDateString());
	};
	
	document.getElementById('hijri_container_'+elementId).appendChild(datePickerHijri.getElement());
	$("#hijri_picker_"+elementId).on("click",function(){
		if (datePickerHijri.isHidden()){ datePickerHijri.show(); } else { datePickerHijri.hide(); }
	});
	
	$(document).mouseup(function(e){
		var container = $(".hijri_container");
		if (!container.is(e.target) && container.has(e.target).length === 0){
			datePickerHijri.hide();
		}
	});
	
	return datePickerElement;
}

//Create Time Input
function createTime(elementId,defaultTime,minTime=null,maxTime=null,step=30,forceRound=true){
	$("#" + elementId).timepicker({
		scrollDefault:defaultTime,
		timeFormat: "h:i A",
		forceRoundTime:forceRound,
		step: step,
		minTime: minTime,
		maxTime: maxTime,
	});
	$("#" + elementId).timepicker("setTime",defaultTime);
}

//Update Time [Rafed Time Slider]
function updateTime(target_id,hour_id,min_id,hour_value,min_value){
	var inputField = document.getElementById(target_id);
	var hourPicker = document.getElementById(hour_id);
	var minutePicker = document.getElementById(min_id);
	if (hour_value){ hourPicker.value = parseInt(hour_value); }
	if (min_value){ minutePicker.value = parseInt(min_value); }
	var dDate = new Date();
	dDate.setHours(hourPicker.value);
	dDate.setMinutes(minutePicker.value);
	dDate.setSeconds(0);
	dDate.setMilliseconds(0);
	var finalTime = dDate.toLocaleString("en-US", {hour:"2-digit", minute:"2-digit", hour12: true});
	inputField.value = finalTime.replace("AM","صباحا").replace("PM","مساءا");
}


//Before Unload Prompt
function beforeUnload(value){
	if (value){
		window.onbeforeunload = function(e){ return true; };
	} else {
		window.onbeforeunload = null;
	}
}

//Set Select Value
function setSelectValue(object, value, defaults=""){
	var element = (object instanceof jQuery || $(object).length ? $(object)[0] : document.getElementById(object));
	if (element){
		for (i = 0; i < element.length; ++i){
			if (element.options[i].value == value){
			  element.value = value;
			  break;
			}
			if (!defaults){
				element.value = (element.options[0].value ? element.options[0].value : "");
			} else {
				element.value = defaults;
			}
		}
	}
}

//Set Select Text
function setSelectText(object,text){
	var element = (object instanceof jQuery || $(object).length ? $(object)[0] : document.getElementById(object));
	for(i = 0; i < element.length; i++)
		if(element.options[i].text==text){
			element.options[i].selected=true;
			return true;
		}
	return false;
}

//Disable Empty Inputs on Form Submit
function disableEmptyInputs(form){ //To be used on form (onsubmit)
	var controls = form.elements;
	for (var i=0, iLen=controls.length; i<iLen; i++){
		controls[i].disabled = controls[i].value == "";
	}
}

//Create Canonical URL
function createCanonical(val,target_id){
	var title = val;
	title = title.replace(/ /g,"-");
	title = title.replace(/[&\/\\#,،+=@()$~%.'":*?<>{}]/g,'');
	title = title.replace(/-+/g,"-");
	document.getElementById(target_id).value = title.toLowerCase();
}

//JSON Validation
function validateJSON(str){
	try {
		JSON.parse(str);
	} catch (e){
		return false;
	}
	return true;
}

//For Inline Javascript Selection
function propagateOptions(category,target,jsonData){
	$(target + " option:not(:first)").remove();
	if (category){
		$.each(jsonData,function(index, value){
			if (value.category == category){
				$(target).append("<option value='" + value.id + "'>" + value.title + "</option>");
			}
		});
	}
}

//Get YouTube Video ID
function getYoutubeID(url){
	var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
	var match = url.match(regExp);
	if (match && match[2].length == 11){
		return match[2];
	}
}

//Add Comma to Numbers
function numberFormat(val){
	while (/(\d+)(\d{3})/.test(val.toString())){
		val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	}
	return val;
}

//Truncate Text
function maxLength(string,letters,prefix=".."){
   if (string.length > letters){
		return string.substring(0,letters) + prefix;
   } else {
		return string;
   }
}

//Left Trim
function ltrim(string,characters){
	if (typeof characters=="string"){
		var regExp = new RegExp("^" + characters, "i");
		return (string + "").replace(regExp, "");
	} else {
		return string.slice(0, -characters);
	}
}

//Right Trim
function rtrim(string,characters){
	if (typeof characters=="string"){
		var regExp = new RegExp(characters + "$", "i");
		return string.replace(regExp, "");
	} else {
		return string.substring(characters);
	}	
}

//Escape HTML Characters
function escapeHTML(text){
  return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

//Escape HTML Characters
function unescapeHTML(text){
  return text
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
}

//Parse URL
function parseURL(url){
	var urlComponent = document.createElement("a");
	urlComponent.href = url;
	return urlComponent;
}

//Validate URL
const isValidURL = (string) => {
	try {
		new URL(string);
		return true;
	} catch (_){
		return false;  
	}
}

//Set Window Location
function setWindowLocation(href,refresh=false){
	window.location.href = href;
}

//Create & Submit Form
function postForm(params, path=null, method="post", target=null, show_loading=true){
    var form = document.createElement("form");
    form.setAttribute("method", method);
    if (path){ form.setAttribute("action", path) }
	if (target){ form.setAttribute("target", target) }
	var tokenField = document.createElement("input");
	tokenField.setAttribute("type", "hidden");
	tokenField.setAttribute("name", "token");
	tokenField.setAttribute("value", user_token);
	form.appendChild(tokenField);	
    for(var key in params){
        if (params.hasOwnProperty(key)){
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);
            form.appendChild(hiddenField);
         }
    }
    document.body.appendChild(form);

	if (onMobile){ //If on mobile application
		if (!target){ //Regular Form Exception
			if (navigator.onLine){
				if ($("body").hasClass("iframe")){
					sendParentMessage("Fancybox-Start-Loading");
				} else {
					sendParentMessage("Webview-Start-Loading");
				}
				form.submit();
			} else {
				sendParentMessage("Call-Function","connectionError");
			}
		} else if (target == "parent" || target == "_blank") { //Form Inside Fancybox Exception
			if (navigator.onLine){
				form.setAttribute("target", "mainWebview")
				sendParentMessage("Webview-Start-Loading");
				form.submit();
			} else {
				sendParentMessage("Call-Function","connectionError");
			}
		}
	} else { //If on browser
		if ((!target || (target && target != "_blank")) && show_loading){
			showLoadingCover();
		}
		form.submit();
	}
}

//Serialize Form to JSON Object
$.fn.serializeObject = function(){
	var o = {};
	var a = this.serializeArray();
	$.each(a, function(){
		if (o[this.name]){
			if (!o[this.name].push){
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || "");
		} else {
			o[this.name] = this.value || "";
		}
	});
	return o;
};

//Reconstruct Header Variables
function reconstructHeaderParameters(remove=[], append=[]){
	var current_parameters = window.location.search.substring(1).split("&");
	var new_parameters = [];
	if (current_parameters){
		for (index = 0; index < current_parameters.length; ++index){
			var parameter = current_parameters[index];
			var param_name = parameter.split("=")[0];
			var param_value = parameter.split("=")[1];
			if (param_name && !remove.includes(param_name)){
				new_parameters.push(param_name + "=" + param_value);
			}
		}
	}
	for (index = 0; index < append.length; ++index){
		new_parameters.push(append[index]);
	}
	return (new_parameters.length ? "?" + new_parameters.join("&") : "");
}

//========== Plugins Functions ==========

//Build Category Data
function doMenuBuild(){
	if ($(".dd-item")[0]){
		$(".dd-item").each(function(){
			contentValues = {};
			$(this).find(".dd3-content").first().find("[category-item]").each(function(){
				contentValues[$(this).attr("category-item")] = escapeHTML($(this).val());
			});
			$(this).data("content",contentValues);
		});
		$("#categories").val($("#domenu").domenu().toJson());
	} else {
		$("#categories").val("");
	}
}

//Validate Single Input
function validateInput(selector){
	$form = $("<form></form>");
	$(selector).clone().removeAttr("data-validation-optional").appendTo($form);
	var inputValid = $form.isValid(validationLanguage, validationConfiguration, false);
	$form.remove();
	return inputValid;	
}

//Animate Object
function animateCSS(element, animationName, callback){
    const node = element;
    node.classList.add("animated", animationName);
    function handleAnimationEnd() {
        node.classList.remove("animated", animationName);
        node.removeEventListener("animationend", handleAnimationEnd);
		if (typeof callback === "function") {callback()};
    }
    node.addEventListener("animationend", handleAnimationEnd);
}

//========== Image Bind Functions (Croppie & Normal Upload) ==========

//Bind Image Cropping to Placeholder
function bindCroppie(selector,width=400,height=400,vwidth=180,vheight=180,boundry=240){
	$("#" + selector).on("change",function(){
		var imageObject = this.files[0];
		var croppieObject = null;
		if (this.files && imageObject){
			if (this.files[0]["type"] && this.files[0]["type"].split('/')[0]=="image" && (this.files[0]["size"] / 1024) <= 2048){
				var crop_image = null;
				var file_name = $(this).val().split(/(\\|\/)/g).pop();
				var reader = new FileReader();
				reader.onload = function(e){
					crop_image = e.target.result;
				}
				reader.readAsDataURL(imageObject);
				$.confirm({
					title: file_name,
					onOpenBefore: function(){
						this.showLoading(true);
					},
					content: "<div id=upload-demo></div>",
					animateFromElement: false,
					boxWidth: "300px",
					useBootstrap: false,
					buttons: {
						save: {
							text: "حفظ",
							btnClass: "btn-primary",
							action: function(){
								croppieObject.result({
									type: "base64",
									size: { width: width, height: height }
								}).then(function (resp){
									$("input[name=" + selector + "_base64]").val(resp).trigger("change");
									$("[image-placeholder=" + selector + "]").attr("src",resp);
									$("[image-placeholder=" + selector + "]").parent().attr("href",resp);
								});
							}
						},
						cancel: {
							text: "إلغاء",
							function (){ /* Do Nothing */ }
						},
					},
					onContentReady: function(){
						croppieObject = new window.parent.Croppie(this.$content.find("#upload-demo")[0], {
							viewport: { width: vwidth, height: vheight },
							boundary: { height: boundry },
							enforceBoundary: true,
						});
						croppieObject.bind({
							url: crop_image
						});
						this.hideLoading(true);
					}
				});
			} else {
				messageBox("خطأ", "تعثر حفظ الصورة، قد يكون حجم الصورة كبيرة جدا او أن الإمتداد الذي اخترته غير مسموح به..", "fas fa-times", "red");
			}
		}
	});
}

//Bind Image Upload to Placeholder
function bindImage(selector){
	$("#" + selector).change(function(){
		var imageObject = this.files[0];
		if (this.files && imageObject){
			if (this.files[0]["type"] && imageObject["type"].split('/')[0]=="image" && (imageObject["size"] / 1024) <= 4096){
				var reader = new FileReader();
				reader.onload = function(e){
					$("[image-placeholder=" + selector + "]").attr("src",e.target.result);
					$("[image-placeholder=" + selector + "]").parent().attr("href",URL.createObjectURL(imageObject));
				}
				reader.readAsDataURL(imageObject);
			} else {
				messageBox("خطأ", "تعثر حفظ الصورة، قد يكون حجم الصورة كبيرة جدا او أن الإمتداد الذي اخترته غير مسموح به..", "fas fa-times", "red");
				$("#" + selector).val(null);
				$("[image-placeholder=" + selector + "]").attr("src","images/placeholder.png");
				$("[image-placeholder=" + selector + "]").parent().attr("href","images/placeholder.png");	
			}
		} else {
			$("[image-placeholder=" + selector + "]").attr("src","images/placeholder.png");
			$("[image-placeholder=" + selector + "]").parent().attr("href","images/placeholder.png");			
		}
	});
}

//Check if a string can split
var canSplit = function(str,token){
    return (str || '').split(token).length > 1;         
}



//Update Select Text per Language or Gender
function updateSelectText(selector, attribute){
	$(selector).find("option").each(function(){
		if ($(this).attr(attribute)){
			$(this).text($(this).attr(attribute));
		}
	});	
}

//Find Duplicates in Array
function findDuplicates(array){
	var arrayDuplicated = new Array();
	for (let i = 0; i < array.length; i++){
		if (array.indexOf(array[i],(i + 1)) > -1){
			arrayDuplicated.push(array[i]);
		}
	}
	return arrayDuplicated;
}

function roundFloat(value){
	return Math.round((value + Number.EPSILON) * 100) / 100;
}

//Convert HEX color to RGB
function hexToRgb(hex){
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

//Replace HTML Tokens
function replaceTokens(HTML, parameters){
    return HTML.split("{{").map(function(i){
        var symbol = i.substring(0, i.indexOf("}}")).trim(); 
        return i.replace(symbol + "}}", parameters[symbol]); 
    }).join("");
}

//Download or view internal pdf file
function internalRecord(page, parameter, filename="ملف", download=true, type="application/pdf"){
	var url = "internal/" + page + "/" + parameter + "/";
	if (download){
		$.confirm({
			content: function(){
				var self = this;
				return $.ajax({
					method: "get",
					url: url,
					xhr: function(){
						var xhr = new XMLHttpRequest();
						xhr.responseType = "blob";
						return xhr;
					}
				}).done(function(response){
					var blob = new Blob([response], { type: type });
					var link = document.createElement("a");
					var url = window.URL.createObjectURL(blob);
					link.href = url;
					link.download = filename + "." + type.split("/")[1];
					link.click();
					$(link).remove();
				}).always(function(){
					self.close();
				});
			}
		});
	} else {
		switch (type){
			case "application/pdf":
				var fancybox_type = "iframe";
			break;
			
			case "image/png":
				var fancybox_type = "image";
			break;
		}
		$.fancybox.open({
			src: url,
			type: fancybox_type,
		});
	}
}

function setDeep(obj, path, value){
	let schema = obj;
	const list = path.split(".");
	const length = list.length;
	for (let i = 0; i < length - 1; i++){
		const elem = list[i];
		if (!schema[elem]){
			schema[elem] = {};
		}
		schema = schema[elem];
	}
	schema[list[length - 1]] = value;
	return schema;
}

function to24HourFormat(timing) {
	let [time, ampm] = timing.split(' ');
	let [hours, minutes] = time.split(':');

	if (hours === '12') { hours = '00'; }
	if (ampm === 'PM') { hours = parseInt(hours, 10) + 12; }

	return `${hours}:${minutes}`;
}

function to12HourFormat(timing) {
	let [hours, minutes] = timing.split(':');

	let ampm = hours >= 12 ? 'PM' : 'AM';
	if (hours === '00') { hours = 12; }

	return `${hours > 12 ? hours - 12 : hours}:${minutes} ${ampm}`;
}

//========== To Be Deleted ==========

//Build Multiple Data Info
function multipleDataCreateRafed(){
	$("[json-custom-data]").each(function(){
		var dataPlaceholder = $(this).attr("json-custom-data");
		var jsonArray = [];
		$(this).find('li').each(function(){
			var infoArray = {};
			$(this).find('[custom-data-item]').each(function(){
				var valueKey = $(this).attr("data-name");
				var cleanValue = ($(this).val() ? $(this).val().replace(/(?:\\[rn])+/g,"").replace(/\\/g,"") : "");
				infoArray[valueKey] = cleanValue;
			});
			jsonArray.push(infoArray);
		});
		if (jsonArray.length){
			var jsonData = JSON.stringify(jsonArray);
			$("#" + dataPlaceholder).val(jsonData);
		} else {
			$("#" + dataPlaceholder).val("");
		}
    });
}


//========== Mobile Application Functions ==========

//Check If URL External
function linkExternal(linkElement){
	var isFile = linkElement.href.match(/\.(pdf|doc|docx|xls|xlsx|zip|7zip|rar|exe)/i);
	if (linkElement.host !== window.location.host || isFile || $(linkElement).attr("download")){
		return true;
	} else {
		return false;
	}
}

//Send Message to Parent [Index]
function sendParentMessage(event_key,event_value){
	parent.postMessage({
		key:event_key,
		value:event_value
	}, "*");
}