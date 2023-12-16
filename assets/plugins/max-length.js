$(document).ready(function(){
	$("[maxlength]").each(function(){
		var maxLengthVerbose = ($(this).attr("verbose") !== undefined ? true : false);
		if (maxLengthVerbose){
			$(this).wrap("<div style='position:relative; width:100%'></div>").after("<div class=max-length></div>");
			
			//Show & Hide Counter
			$(this).bind("focus", function (){
				updateMaxLength($(this));
				$(this).parent().find(".max-length").fadeIn(200);
			}).bind("blur", function (){
				$(this).parent().find(".max-length").fadeOut(200);
			});
		}
		$(this).on("input",function(){
			var maxLength = $(this).attr("maxlength");
			var value = $(this).val();
			if (value.length >= maxLength){
				$(this).val(function(){
					return value.substr(0, maxLength);  
				});
			}
			if (maxLengthVerbose){
				updateMaxLength($(this));
			}
		});
	});
	
	function updateMaxLength($input){
		var maxLength = $input.attr("maxlength");
		var currentLength = $input.val().length;
		var percent = Math.round(currentLength * 100 / maxLength);
		var color = "hsla(" + ((1-percent/100)*120).toString(10) + ",50%,50%,.85)";
		$input.parent().find(".max-length").css("background",color).html(currentLength + " / " + maxLength);		
	}
});