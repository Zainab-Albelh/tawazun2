/* Same Page URL [For Modules] */
$(window).on("load",function(){
	String.prototype.trimRight = function(charlist){
		if (charlist === undefined){ charlist = "\s"; }
		return this.replace(new RegExp("[" + charlist + "]+$"), "");
	};
});

$(document).ready(function(){
	$(".nav-dropdown-item").click(dropdownClick).on("click", "div", function(e){
		e.stopPropagation();
	});
	
	var hoverTimeout;
	$(".nav-dropdown-item").hover(function(){
		clearTimeout(hoverTimeout);
		$(".nav-dropdown-item").each(function(){
			$(this).removeClass("hover");
		});
		$(this).addClass("hover");
	}, function(){
		var $self = $(this);
		hoverTimeout = setTimeout(function(){
			$self.removeClass("hover");
		}, 250);
	});

	$(".nav-cover").click(hideNavMenu);
});

//Override Navigation Menu Dropdown Click
function dropdownClick(){
	if ($(window).width() < 992){
		event.preventDefault();
		var navDropdown = $(this).find(".nav-dropdown");
		$(".nav-dropdown-item.active").each(function(){
			hideDropdown($(this));
		});
		if (navDropdown.css("display") == "none"){
			showDropdown($(this));
		} else {
			hideDropdown($(this));
		}
	}
}

//Hide Navigation Dropdown Child
function hideDropdown(object){
	if ($(window).width() < 992){
		var objHeight = object.find(".nav-dropdown").height();
		object.find(".nav-dropdown").animate({
			height: "0px"
		}, 300, function(){
			$(this).css("height", objHeight + "px").css("display", "none");
		});
		object.removeClass("active");
	}
}

//Show Navigation Dropdown Child
function showDropdown(object){
	if ($(window).width() < 992){
		var objHeight = object.find(".nav-dropdown").height();
		object.find(".nav-dropdown").css("height", "0px").css("display", "block").animate({
			height: objHeight + "px"
		}, 300, function(){
			scrollToView(object,-parseFloat(object.css("border-bottom-width")),"start");
		});
		object.addClass("active");
	}
}

//Hide Navigation Menu
function hideNavMenu(){
	if ($(window).width() < 992){
		$(".nav-cover").css("visibility", "hidden").css("opacity", "0");
		$(".nav-menu").removeClass("nav-menu-opened").delay(500).queue(function(){
			$(".nav-dropdown-item.active").each(function(){
				hideDropdown($(this));
			});
			$(".nav-menu").css("transition", "transform 0s");
			$(this).dequeue();
		});
	}
}

//Show Navigation Menu
function showNavMenu(){
	if ($(window).width() < 992){
		$(".nav-cover").css("visibility", "visible").css("opacity", "1");
		$(".nav-menu").css("transition", "transform 0.5s").addClass("nav-menu-opened");
	}
}