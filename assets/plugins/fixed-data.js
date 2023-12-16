function fixedDataBuild(){
	$("[json-fixed-data]").each(function(){
		var dataPlaceholder = $(this).attr("json-fixed-data");
		var infoArray = {};
		$(this).find("li").each(function(){
			var valueKey = $(this).find("[data-name]").attr("data-name");
			var valueClean = ($(this).find("[data-name]").val() ? $(this).find("[data-name]").val().replace(/(?:\\[rn])+/g,"").replace(/\\/g,"") : "");
			infoArray[valueKey] = valueClean;
		});
		var jsonData = JSON.stringify(infoArray);
		$("#" + dataPlaceholder).val(jsonData);
    });	
}

function fixedDataRead(placeholder,data){
	var jsonArray = jQuery.parseJSON(JSON.stringify(data));
	$.each(jsonArray,function(index, value){
		$("[json-fixed-data=" + placeholder + "] li [data-name='" + index + "']").val(value);
	});
}