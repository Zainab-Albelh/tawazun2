function handleFileSelect(event){
	attachmentsStartUpload(event.target.id);
}

function attachmentsStartUpload(pluginID){
	var totalFiles = document.getElementById(pluginID).files.length;
	if (totalFiles){
		$("td[data-attachments=" + pluginID + "]").find(".attachment-button label").attr("disabled", "disabled");
		$("td[data-attachments=" + pluginID + "]").find(".attachment-button input[type=file]").attr("disabled", "disabled");
		$("td[data-attachments=" + pluginID + "]").find(".attachment-button div").css("display", "flex");
		var myFormData = new FormData();
		for (var x = 0; x < totalFiles; x++){
			var dataToken = $("td[data-attachments=" + pluginID + "]").attr("data-token");
			var folderPath = $("td[data-attachments=" + pluginID + "]").attr("data-upload-path");
			myFormData.append("token", dataToken);
			myFormData.append("path", folderPath);
			myFormData.append("files[]", document.getElementById(pluginID).files[x]);
		}
		$.ajax({
			type: "post",
			url: (folderPath.includes("rafed/") ? "uploader/" : "__uploader.php"),
			data: myFormData,
			dataType: "text",
			cache: false,
			contentType: false,
			processData: false,
			success: function(response){
				if (response){
					var jsonObject = jQuery.parseJSON(response);
					jsonObject.forEach(function(fileData){
						attachmentsLoadFile(fileData, pluginID);
					});
					$(document).ready(function(){
						var callbackFunction = window["attachmentsOnUpload_" + pluginID];
						if (typeof callbackFunction === "function"){
							callbackFunction(pluginID, response);
						}
					});
				} else {
					messageBox("خطأ","خطأ في رفع الملف، قد يكون حجم الملف اكبر من الحد الاقصي او أن امتداد الملف غير مسموح به..","fas fa-times","red");
				}
			},
			error: function(request,status,error){
				messageBox("خطأ","خطأ في رفع الملف، قد يكون حجم الملف اكبر من الحد الاقصي او أن امتداد الملف غير مسموح به..","fas fa-times","red");
			},
			complete: function(request,status){
				$("td[data-attachments=" + pluginID + "]").find(".attachment-button label").removeAttr("disabled");
				$("td[data-attachments=" + pluginID + "]").find(".attachment-button input[type=file]").removeAttr("disabled");
				$("td[data-attachments=" + pluginID + "]").find(".attachment-button div").css("display", "none");
			}
		});
	}
}

function attachmentsLoadFile(jsonData, pluginID){
	var uniqueID = Date.now() + Math.floor((Math.random() * 999) + 100);
	var fileExtension = jsonData.url.split(/\#|\?/)[0].split('.').pop().trim().toLowerCase();
	var uploadPath = $("td[data-attachments=" + pluginID + "]").attr("data-upload-path");
	switch (fileExtension){
		case "png":
		case "jpg":
		case "jpeg":
		case "bmp":
		case "gif":
			var preview = "<a data-fancybox=images class=image style=\"background-image:url('" + uploadPath + jsonData.url + "')\" href='" + uploadPath + jsonData.url + "'></a>";
			break;
		case "zip":
		case "rar":
			var preview = "<i class='fas fa-file-archive'></i>";
			break;
		case "xls":
		case "xlsx":
			var preview = "<i class='fas fa-file-excel'></i>";
			break;
		case "doc":
		case "docx":
			var preview = "<i class='fas fa-file-word'></i>";
			break;
		case "pdf":
			var preview = "<i class='fas fa-file-pdf'></i>";
			break;
		default:
			var preview = "<i class='fas fa-file'></i>";
	}
	var attachmentBlock = "<li id='" + uniqueID + "' data-url='" + jsonData.url + "' data-title='" + jsonData.title + "'>" +
		"<div class=attachment-block>" +
		"<div class=attachment-preview>" + preview + "</div>" +
		"<div class=attachment-details><span>" + jsonData.title + "</span><small>" + fileExtension + "</small></div>" +
		"<div class=attachment-buttons>" +
		"<a onclick='attachmentsRemoveFile(" + uniqueID + ")'><i class='fas fa-times'></i></a>" +
		"<a href='" + uploadPath + jsonData.url + "' download='" + (!jsonData.title ? "" : jsonData.title + "." + fileExtension) + "'><i class='fas fa-download'></i></a>" +
		"<a onclick='attachmentsEditFile(" + uniqueID + ")'><i class='fas fa-edit'></i></a>" +
		"</div>" +
		"</div>" +
		"</li>";
	$("td[data-attachments=" + pluginID + "]").find("[sortable]").append(attachmentBlock);
}

function attachmentsRemoveFile(uniqueID){
	$.confirm({
		title: "حذف",
		content: "هل انت متأكد من رغبتك في حذف هذا الملف؟",
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

function attachmentsEditFile(uniqueID){
	var defaultTitle = $("#" + uniqueID).find(".attachment-details span").html();
	$.confirm({
		title: "تحديث",
		content: "<input type=text style='border-radius:3px' value='" + defaultTitle + "'>",
		icon: "fas fa-edit",
		theme: "light-noborder",
		buttons: {
			save: {
				text: "حفظ",
				btnClass: "btn-green",
				action: function (){
					var newTitle = this.$content.find("input").val();
					$("#" + uniqueID).attr("data-title", newTitle);
					$("#" + uniqueID).find(".attachment-details span").html(newTitle);
				}
			},
			cancel: { text: "إلغاء" }
		}
	});	
}

function attachmentsBuild(){
	$("[data-attachments]").each(function(){
		var filesArray = [];
		$(this).find("ul li").each(function(){
			var fileObject = {};
			fileObject.url = $(this).attr("data-url");
			fileObject.title = $(this).attr("data-title");
			filesArray.push(fileObject);
		});
		$(this).find("input[type=hidden]").val((filesArray.length ? JSON.stringify(filesArray) : ""));
	});
}

$(document).ready(function(){
	$("[data-attachments]").each(function(){
		$(this).find("[sortable]").sortable({
			containment: $(this)
		});
		$(this).find("input[type=file]")[0].addEventListener("change",handleFileSelect,false);
	});
});