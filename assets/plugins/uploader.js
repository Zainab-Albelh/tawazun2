//Preview Images on Upload Click
function uploaderListener(event) {
	uploaderStartUpload(event.target.id);
}

function uploaderStartUpload(pluginID){
	var totalFiles = document.getElementById(pluginID).files.length;
	if (totalFiles){
		$("td[images-containemnt=" + pluginID + "]").find("label").attr("disabled", "disabled");
		$("td[images-containemnt=" + pluginID + "]").find("input[type=file]").attr("disabled", "disabled");
		//$("td[images-containemnt=" + pluginID + "]").find(".attachment-button div").css("display", "flex");
		var myFormData = new FormData();
		for (var x = 0; x < totalFiles; x++){
			var dataToken = $("td[images-containemnt=" + pluginID + "]").attr("data-token");
			var folderPath = "uploads/" + pluginID + "/";
			myFormData.append("token", dataToken);
			myFormData.append("path", folderPath);
			myFormData.append("files[]", document.getElementById(pluginID).files[x]);
		}
		$.ajax({
			type: "post",
			url: "__uploader.php",
			data: myFormData,
			dataType: "text",
			cache: false,
			contentType: false,
			processData: false,
			success: function(response){
				if (response){
					var jsonObject = jQuery.parseJSON(response);
					jsonObject.forEach(function(fileData){
						uploaderLoadFile(fileData, pluginID);
					});
				} else {
					messageBox("خطأ","خطأ في رفع الملف، قد يكون حجم الملف اكبر من الحد الاقصي او أن امتداد الملف غير مسموح به..","fas fa-times","red");
				}
			},
			error: function(request,status,error){
				messageBox("خطأ",request.responseText,"fas fa-times","red");
			},
			complete: function(request,status){
				$("td[images-containemnt=" + pluginID + "]").find("label").removeAttr("disabled");
				$("td[images-containemnt=" + pluginID + "]").find("input[type=file]").removeAttr("disabled");
				//$("td[images-containemnt=" + pluginID + "]").find(".attachment-button div").css("display", "none"); //hide loading
			}
		});
	}
}

//Load Image File
function uploaderLoadFile(jsonData, pluginID){
	var uniqueID = Date.now() + Math.floor((Math.random() * 999) + 100);
	var folderPath = "uploads/" + pluginID + "/";
	var imageName = (typeof jsonData.url !== "undefined" ? jsonData.url : jsonData);
	var imagePath = folderPath + imageName;
	var imageObject = "<a data-fancybox=images href='" + imagePath + "'><img unique-id='" + uniqueID + "' src='" + imagePath + "'></a>";
	var imageBlock = "<li id='" + uniqueID + "' filename='" + imageName + "'><input type=button class=remove_image value='×' onclick=\"uploaderRemoveImage('" + uniqueID + "')\">" + imageObject + "</li>";
	$("td[images-containemnt=" + pluginID + "]").find(".images_sortable").append(imageBlock);
}

//Upload Next Images
function imagesUploaderBuild(){
	$("[images-containemnt]").each(function(){
		var filesArray = [];
		$(this).find("ul li").each(function(){
			filesArray.push($(this).attr("filename"));
		});
		$(this).find("input[type=hidden]").val((filesArray.length ? filesArray.join("\r\n") : ""));
	});	
}

//Remove Info Item
function uploaderRemoveImage(uniqueID){
	$.confirm({
		title: "حذف",
		content: "هل انت متأكد من رغبتك في حذف هذه الصورة؟",
		icon: "fas fa-trash",
		buttons: {
			yes: {
				text: "نعم",
				btnClass: "btn-red",
				action: function(){
					$("#" + uniqueID).remove();
				}
			},
			cancel: { text: "إلغاء" }
		}
	});
}

$(document).ready(function(){
	$("[images-containemnt]").each(function(){
		$(this).find("[sortable]").sortable({
			containment: $(this)
		});
		$(this).find("input[type=file]")[0].addEventListener("change",uploaderListener,false);
	});
});














//Load Images to Position
function loadImage(src, pluginID="", uploaded=""){
	var uniqueID = Date.now() + Math.floor((Math.random() * 999) + 100);
	var imagePath = src;
	var image_object = "<a data-fancybox=images href='" + imagePath + "'><img unique-id='" + uniqueID + "' src='" + imagePath + "'></a>";
	var pieces = src.split('/');
	var image_block = "<li id='" + uniqueID + "' filename='" + pieces[pieces.length-1] + "'><input type=button class=remove_image value='×' onclick=\"uploaderRemoveImage('" + uniqueID + "')\">" + image_object + "</li>";
	$("td[images-containemnt=" + pluginID + "]").find(".images_sortable").append(image_block);
}

//Upload Images with AJAX
function uploadImageAjax(imageData){
	var unique_ids_array = [];
	$("[images-sortable=" + imageData + "] li").each(function(){
		unique_ids_array.push($(this).find("img").attr("unique-id"));
	});
	var formData = new FormData();
	formData.append("action", "upload_multiple_images");
	formData.append("unique_ids", unique_ids_array.join(","));
	formData.append("uploads_folder", imageData);
	$("[images-sortable=" + imageData + "] li").each(function(){
		var base64image = btoa($(this).find("img").attr("src"));
		var uniqueID = $(this).find("img").attr("unique-id");
		var uploaded = $(this).find("img").attr("uploaded");
		formData.append("image_" + uniqueID, base64image);
		formData.append("uploaded_" + uniqueID, uploaded);
	});
	$.ajax({
	   type : "POST",
	   url: "__requests.php",
	   async: true,
	   data : formData,
	   processData: false,
	   contentType: false,
	   success : function(data) {
		   $("[ajax-images-data=" + imageData + "]").val(data);
		   imagesUploaderBuild();
	   }
	});
}



/* ===================== */

//Upload Images with AJAX [Website]
function uploadImageAjaxWebsite(imageData){
	var unique_ids_array = [];
	$("[images-sortable=" + imageData + "] li").each(function(){
		unique_ids_array.push($(this).find("img").attr("unique-id"));
	});
	var formData = new FormData();
	formData.append("action", "upload_multiple_images");
	formData.append("unique_ids", unique_ids_array.join(","));
	formData.append("uploads_folder", imageData);
	$("[images-sortable=" + imageData + "] li").each(function(){
		var base64image = btoa($(this).find("img").attr("src"));
		var uniqueID = $(this).find("img").attr("unique-id");
		var uploaded = $(this).find("img").attr("uploaded");
		formData.append("image_" + uniqueID, base64image);
		formData.append("uploaded_" + uniqueID, uploaded);
	});
	$.ajax({
	   type : "POST",
	   url: "requests/",
	   async: true,
	   data : formData,
	   processData: false,
	   contentType: false,
	   success : function(data) {
		   $("[ajax-images-data=" + imageData + "]").val(data);
		   imagesUploaderBuildWebsite();
	   }
	});
}

//Upload Next Images [Website]
function imagesUploaderBuildWebsite(){
	if (multipleImages[0]){
		uploadImageAjaxWebsite(multipleImages[0]);
		multipleImages.splice(0,1);
	} else {
		$("#submit_form").submit();
	}
}















//Remove Info Item
function removeItem(object_id){
	bootbox.confirm("هل انت متأكد من رغبتك في حذف هذه البيانات؟ لن تستطيع استعادتها مرة اخري.", function(result){
		if (result){ $("#" + object_id).remove(); }
	});
}