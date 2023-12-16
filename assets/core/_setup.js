//Form Validation Configuration
var errors = [];

var validationLanguage = {
	errorTitle: "خطأ في البيانات المدخلة",
	requiredFields: "لم تقم بإدخال كافة البيانات المطلوبة",
	badEmail: "لم تقم بإدخال البريد الإلكتروني بشكل صحيح"
};

var validationConfiguration = {
	validateOnBlur: false,
	errorMessagePosition: "top",
	scrollToTopOnError: false,
	validateHiddenInputs: true,
	language: validationLanguage,
	onElementValidate: function(valid, $el, $form, errorMess){
		if (!valid){ errors.push({el: $el, error: errorMess}); }
	}
};

//Validate Mime
$.formUtils.addValidator({
	name: "validateMime",
	validatorFunction: function(value, $el, config, language, $form){
		if ($el[0].files.length){
			var allowedMimes = $el.attr("allowed-mimes").split(",");
			return allowedMimes.includes($el[0].files[0].type);
		} else {
			return ($el.attr("data-mandatory") ? false : true);
		}
	},
	errorMessage: "لم تقم بإدخال كافة البيانات المطلوبة"
});

//Validate Attachments
$.formUtils.addValidator({
	name: "validateAttachments",
	validatorFunction: function(value, $el, config, language, $form){
		var target = $("[data-attachments=" + $el.attr("name") + "]").find("ul li");
		return (target.length ? true : false);
	},
	errorMessage: "لم تقم بإدخال كافة البيانات المطلوبة"
});

//Required If Visible
$.formUtils.addValidator({
	name: "requiredVisible",
	validatorFunction: function(value, $el, config, language, $form){
		if ($el.is(":visible") && !value){
			return false;
		} else {
			return true;
		}
	},
	errorMessage: "لم تقم بإدخال كافة البيانات المطلوبة"
});

//Required If Parent Table Row is Visible [Used for Select2 Search]
$.formUtils.addValidator({
	name: "requiredParentVisible",
	validatorFunction: function(value, $el, config, language, $form){
		if ($el.parents("tr").is(":visible") && (!value || value==0)){
			return false;
		} else {
			return true;
		}
	},
	errorMessage: "لم تقم بإدخال كافة البيانات المطلوبة"
});

//Validate YouTube URL
$.formUtils.addValidator({
	name: "validateYouTube",
	validatorFunction: function(value, $el, config, language, $form){
		if (value && getYoutubeID(value)){
			return true;
		} else {
			return false;
		}
	},
	errorMessage: "يجب ان يكون رابط الفيديو علي يوتيوب"
});	

//Submit Button
$("form .submit").not("#submit_button").not(".submit_button").on("click", function(){
	errors = [];
	if (typeof onBeforeValidation === "function"){ onBeforeValidation() }
	if (!$(this).parents("form:first").isValid(validationLanguage, validationConfiguration, true)){
		scrollToView($(".form-error"), $("#nav-sticky").outerHeight()+10, "start");	
	} else {
		formSubmit($(this).parents("form:first"));
	}
});

//Initialize JSConfirm
var jconfirmInstance = null;
jconfirm.defaults = {
	rtl: true,
	theme: "light-noborder",
	animateFromElement: false,
	containerFluid: true,
	container: parent.document.getElementsByTagName("body"),
	buttons: {},
	onOpenBefore: function(){
		jconfirmInstance = this;
	},
	onClose: function(){
		jconfirmInstance = null;
	},
	defaultButtons: {
		ok: {
			text: "موافق",
			action: function (){}
		},
		cancel: {
			text: "إلغاء",
			action: function (){}
		},
	},
};

//Initialize Data Tables (If Exists)
if (typeof $.fn.dataTable !== "undefined"){
	$.extend(true,$.fn.dataTable.defaults,{
		language: {
			"decimal":        "",
			"emptyTable":     "لا يوجد سجلات",
			"info":           "معروض _START_ الي _END_ من _TOTAL_ سجل",
			"infoEmpty":      "لا يوجد سجلات",
			"infoFiltered":   "",
			"infoPostFix":    "",
			"thousands":      ",",
			"lengthMenu":     "_MENU_",
			"loadingRecords": "جاري التحميل..",
			"processing":     "جاري التحميل..",
			"search":         "",
			"zeroRecords":    "لا يوجد سجلات مطابقة",
			"paginate": {
				"first":      "الاولي",
				"last":       "الاخيرة",
				"next":       "التالي",
				"previous":   "السابق"
			},
			"aria": {
				"sortAscending":  "",
				"sortDescending": ""
			}
		}
	});
}

//Initialize Bootbox (If Exists)
if (typeof bootbox !== "undefined"){
	bootbox.addLocale("ar", {
		OK : "موافق",
		CANCEL : "إلغاء",
		CONFIRM : "تأكيد"
	});
	bootbox.setLocale("ar");
}
	
//Prevent POST on Refresh
if (typeof replaceState === "undefined" || replaceState == false){
	if (window.history.replaceState){
		window.history.replaceState(null, null, window.location.href);
	}
}

//Initialize Fancybox
$.fancybox.defaults.buttons = ["close"];
$.fancybox.defaults.autoSize = false;
$.fancybox.defaults.protect = true;
$.fancybox.defaults.parentEl = parent.document.getElementsByTagName("body");
$.fancybox.defaults.iframe.preload = true;
$(parent).on("beforeLoad.fb", function(e,instance,slide){
	//For Mobile Only
	if (onMobile && !navigator.onLine){
		sendParentMessage("Call-Function","connectionError");
		instance.close();
		return false;
	}
	var element = slide.opts.$orig;
	if (element){
		slide.opts.iframe.css = (element.data("frame-width") ? {width: element.data("frame-width")} : {});
	}
});
$(parent).on("afterShow.fb", function(e,instance,slide){
	slide.opts.iframe.preload = false;
	if (typeof slide.$iframe !== "undefined"){
		slide.$iframe.unbind();
	}
});
$(parent).on("afterClose.fb", function(e,instance,slide){
	if (instance.current.opts.$orig[0].hasAttribute('data-refresh')){
		parent.location.reload(true);
	}
});

//Disable Form Submit on Enter
$("form input").on("keyup keypress", function(e){
	var keyCode = e.keyCode || e.which;
	if (keyCode === 13){
		e.preventDefault();
		if ($(this).attr("disable-enter")){
			return false;
		} else {
			$(this).parent("form").find(".submit").click();
		}
	}
});

//Initialize Bootstrap Scripts
$("[data-toggle=tooltip]").tooltip();
$("[data-toggle=popover]").popover();

//Initialize Waves
if (typeof Waves !== "undefined"){
    Waves.init();
}

//Initialize Fancy & Manage Tables Data-Label
$("table.fancy, table.manage").each(function(){
	var table = $(this);
	var table_header = [];
	table.find("thead tr th").each(function(){
		table_header.push($(this).text());
	});
	table.find("tbody tr").each(function(){
		$(this).find("td").each(function(index){
			if (!$(this).attr("data-label")){
				$(this).attr("data-label",table_header[index]);
			}
		});	
	});	
});

//Form Submit If (formSubmit) Not Defined
if (typeof window.formSubmit === "undefined"){
    window.formSubmit = function(form){
		if (typeof attachmentsBuild === "function"){ attachmentsBuild() }
		if (typeof imagesUploaderBuild === "function"){ imagesUploaderBuild() }
		if (typeof multipleDataBuild === "function"){ multipleDataBuild() }
		if (typeof fixedDataBuild === "function"){ fixedDataBuild() }
		if (typeof doMenuBuild === "function"){ doMenuBuild() }
		if (typeof onBeforeSubmit === "function"){ onBeforeSubmit() }
		$(form).submit();
    }
}

//Show Loading on Form Submit
$("form:not([loading=false])").on("submit",function(){
	showLoadingCover();
});

//========== Rafed Website Only ==========

//Show Bootstrap Dropdown on Hover
$(function(){
	if (/Mobi|Android/i.test(navigator.userAgent)==false){
		$(".dropdown[show-on-hover]").hover(function(){
			$(this).addClass("open");
		},
		function(){
			$(this).removeClass("open");
		});
	}
});

//Update Sticky Header
$(window).on("load",function(){
	$("#nav-sticky").sticky("update");
});
$(window).resize(function() {
	$("#nav-sticky").sticky("update");
});

if (typeof SmoothScroll !== "undefined"){
	//Initialize Smooth Scroll
	SmoothScroll({
		//Scrolling Core
		animationTime    : 600, //ms
		stepSize         : 80, //px

		//Acceleration
		accelerationDelta : 20,
		accelerationMax   : 2,

		//Keyboard Settings
		keyboardSupport   : true,
		arrowScroll       : 50, //px

		//Pulse (less tweakable) - Ratio of "tail" to "acceleration"
		pulseAlgorithm   : true,
		pulseScale       : 4,
		pulseNormalize   : 1,

		//Other
		touchpadSupport   : false, //Ignore touchpad by default
		fixedBackground   : true, 
		excluded          : ""
	});
}

//Hide loading cover on load
$(document).ready(function(){
	hideLoadingCover();
});

$(document).ready(function(){
	//Initialize Sticky Header
	$("#nav-sticky").sticky({
		className: "nav-stuck",
		topSpacing: 0,
		bottomSpacing: 0,
		zIndex: 1000
	});
	
	//Initialize Animations
	AOS.init({easing:"ease-in-out-sine"});

	//Attach Fancybox to WYSIWYG Content
	$(".html-content img").each(function(){
		if (!$(this).parent().is("a")){
			$(this).wrap("<a data-fancybox=images href='" + $(this).attr("src") + "'></a>");
		}
	});
	
	//Bind donation spinner button
	$(".input_spinner button").bind("click", function(event) {
        var button = $(this);
        var input = button.parent().find("input");
		var value = parseInt(input.val());
		var new_value = 0;
		var minimum = parseInt(input.attr("min"));
		var maximum = parseInt(input.attr("max"));
        button.parent().find("button").prop("disabled", false);
    	if (button.attr("data-dir")=="up"){
			if (value < minimum){
				new_value = minimum;
			} else if (value > maximum){
				new_value = maximum;
			} else if (value < maximum){
				new_value = value + 1;
			}
			input.val(new_value).trigger("input");
			if (new_value >= maximum){ button.prop("disabled", true); }
    	} else if (button.attr("data-dir")=="down"){
			if (value > maximum){
				new_value = maximum;
			} else if (value < minimum){
				new_value = minimum;
			} else if (value > minimum){
				new_value = value - 1;
			}
			input.val(new_value).trigger("input");
			if (new_value <= minimum ){ button.prop("disabled", true); }
    	}
    });	
});

//Console Warnings
var cssRule = "color: red; font-size: 30px; font-weight: bold; text-shadow: 1px 1px 5px rgb(249, 162, 34); filter: dropshadow(color=rgb(249, 162, 34), offx=1, offy=1);";
setTimeout(console.log.bind(console, "%c" + "تحذير", cssRule), 0);

var cssRule = "color: #404040; font-size: 14px; font-weight: bold;";
setTimeout(console.log.bind(console, "%c" + "هذه الصفحة خاصة بمديرين الموقع فقط و غير مصرح للاعضاء او الزوار بدخولها - تم تسجيل رقم الاي بي الخاص بجهازك و مراقبة التعديلات التي يتم اجراءها", cssRule), 0);

//===== Cart =====

//Update amount on shares input
$("[marketing-block] input[name=shares]").on("input", function(){
	var container = $(this).closest("[marketing-block]");
	var share_price = $(this).closest("[share-price]").attr("share-price");
	container.find("[name=amount]").val($(this).val() * share_price);
});

//Update amount on donation label change
$("[marketing-block] label").on("click", function(){
	var container = $(this).closest("[marketing-block]");
	container.find("[name=amount]").val($(this).data("amount"));
});

//Update amount on donation label change
$("[marketing-block] [cart-insert]").on("click", function(){
	var checkout = ($(this).attr("cart-insert")=="checkout" ? true : false);
	var container = $(this).closest("[marketing-block]");
	var marketing_id = container.attr("marketing-block");
	var marketing_data = JSON.parse(atob(container.attr("marketing-data")));
	var amount_object = container.find("[name=amount]");
	var amount = (isNaN(parseInt(amount_object.val())) ? 0 : parseFloat(amount_object.val()));
	var minimum = (isNaN(parseInt(amount_object.attr("min"))) ? 0 : parseInt(amount_object.attr("min")));
	var maximum = (isNaN(parseInt(amount_object.attr("max"))) ? 0 : parseInt(amount_object.attr("max")));
	
	if (amount < minimum){
		quickNotify("الحد الأدني للتبرع لصالح <b>" + marketing_data.title + "</b> هو <b>" + minimum + "</b> ريال سعودي", "تعثر الإضافة للسلة", "danger", "fal fa-times-circle fa-3x");
	} else if (amount > maximum){
		quickNotify("الحد الأقصي للتبرع لصالح <b>" + marketing_data.title + "</b> هو <b>" + maximum + "</b> ريال سعودي", "تعثر الإضافة للسلة", "danger", "fal fa-times-circle fa-3x");
	} else {
		cartInsert(marketing_id, amount, marketing_data, checkout);
	}
});

//Cart remove button
$(document).on("click", "[cart-remove]", function(){
	var marketing_id = $(this).closest("[cart-item=row]").attr("marketing-id");
	cartRemove(marketing_id);	
});

//Insert cart item
function cartInsert(marketing_id, amount, marketing_data, checkout=false){
	$.confirm({
		content: function (){
			var self = this;
			self.showLoading();
			return $.ajax({
				type: "POST",
				url: "requests/",
				data: {
					token: user_token,
					action: "cart_insert",
					marketing_id: marketing_id,
					amount: amount
				}
			}).done(function(response){
				if (checkout){
					cartReload();
					self.close();
					setWindowLocation("checkout/");
				} else {
					quickNotify("تم إضافة التبرع بمبلغ <b>" + amount + "</b> ريال سعودي لصالح <b>" + marketing_data.title + "</b> للسلة بنجاح!", "تم الإضافة للسلة", "success", "fal fa-check-circle fa-3x");
					cartReload();
				}
			}).fail(function(response){
				quickNotify(response.responseText, "تعثر الإضافة للسلة", "danger", "fal fa-times-circle fa-3x");
			}).always(function(){
				self.close();
			});
		}
	});
}

//Remove cart item
function cartRemove(marketing_id, callback=null){
	$.ajax({
		type: "POST",
		url: "requests/",
		data: {
			token: user_token,
			action: "cart_remove",
			marketing_id: marketing_id
		},
		success: function(result){
			cartReload();
			if (typeof callback === "function"){
				callback();
			}
		}
	});
}

//Reload cart content
function cartReload(){
	$.ajax({
		type: "POST",
		url: "requests/",
		data: {
			token: user_token,
			action: "cart_reload"
		}
	}).done(function(response){
		//Cart is empty
		if (!response){
			//Cart Count
			$(".cart_count").removeClass("active");
			$(".cart_count").text(0);
			
			//Cart Update
			$("[cart-template]").each(function(){
				var target = $("." + $(this).attr("cart-template"));
				target.find("[cart-item]").remove();
				
				//Empty Cart DOM
				var clone = $(this).find("[cart-item=empty]").clone();
				clone.appendTo(target);
				
				//Show/Hide in cart for blocks
				$(document).ready(function(){
					$("[show-in-cart]").hide();
					$("[hide-in-cart]").show();
				});
			});

		//Cart is not empty
		} else {
			var response = JSON.parse(response);
			
			//Cart Count
			$(".cart_count").addClass("active");
			$(".cart_count").text(response.cart_count);
						
			//Cart Update
			$("[cart-template]").each(function(){
				var template = $(this);
				var target = $("." + $(this).attr("cart-template"));
				target.find("[cart-item]").remove();

				//Cart Rows DOM
				response.marketing_data.forEach(function(item, index){
					var clone = template.find("[cart-item=row]").clone();
					clone.attr("marketing-id", response.marketing_data[index].id);
					var replace = replaceTokens(clone.prop("outerHTML"), response.marketing_data[index]);
					target.append(replace);
				});
				
				//Cart Append DOM
				var clone = $(this).find("[cart-item=append]").clone();
				var replace = replaceTokens(clone.prop("outerHTML"), response);
				target.append(replace);
			});

			//Show/Hide in cart for blocks
			$("[marketing-block]").each(function(){
				var marketing_id = $(this).attr("marketing-block");
				if (response.marketing_ids.includes(parseInt(marketing_id))){
					$("[marketing-block=" + marketing_id + "] [show-in-cart]").show();
					$("[marketing-block=" + marketing_id + "] [hide-in-cart]").hide();							
				} else {
					$("[marketing-block=" + marketing_id + "] [show-in-cart]").hide();
					$("[marketing-block=" + marketing_id + "] [hide-in-cart]").show();					
				}
			});
		}
		
		//Call on cart reload function if exists
		if (typeof onCartReload==="function"){
			onCartReload(response);
		}
	});
}

//Reload cart
$(document).ready(function(){
	cartReload();
});
			
//Program enroll
function programEnroll(program_id,program_title="برنامج تدريبي"){
	$.confirm({
		icon: "fa fa-laptop",
		title: "الإنضمام لبرنامج",
		content: "هل أنت متأكد من رغبتك في الإنضمام لبرنامج " + program_title + "؟",
		theme: "modern",
		closeIcon: true,
		buttons: {
			Ok: {
				text: "نعم",
				btnClass: "btn-primary",
				action: function(){
					postForm({
						program_id: program_id,
					}, "programs-register/");
				}
			},
			Cancel: {
				text: "إلغاء",
				btnClass: "btn-default",
			}
		}
	});
}

//Chance enroll
function chanceEnroll(chance_id,chance_title="فرصة تطوعية"){
	$.confirm({
		icon: "fa fa-heart",
		title: "تطوع لفرصة",
		content: "هل انت متأكد من رغبتك في التطوع لهذه الفرصة " + chance_title + "؟ بالتقدم لها قد تحرم غيرك منها..",
		theme: "modern",
		closeIcon: true,
		buttons: {
			Ok: {
				text: "نعم",
				btnClass: "btn-primary",
				action: function(){
					postForm({
						chance_id: chance_id,
					}, "chances/");
				}
			},
			Cancel: {
				text: "إلغاء",
				btnClass: "btn-default",
			}
		}
	});
}

$("iframe").each(function(){
	var src = $(this).attr("src");
	var ext = src.substring(src.lastIndexOf('/')+1).split('.').pop().toLowerCase();
	if (ext == "pdf"){
		$(this).attr("src", "pdf-render/?file=" + $("base").attr("href") + src).addClass("pdf_render");
	}
});