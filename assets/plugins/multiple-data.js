function multipleDataCreate(target, jsonData){
	var uniqueID = (Date.now() * 10000 + Math.random() * 10000).toString(16).replace(/\./g, "").padEnd(14, "0");
	var clonedObject = $("[data-multiple='" + target + "']").find("[data-template]").clone();
		clonedObject.appendTo("[data-multiple='" + target + "'] [multiple-sortable]")
		.removeAttr("data-template")
		.attr("id", uniqueID)
		.attr("multiple-item", uniqueID)
		.css("display", "list-item");
	clonedObject.find(".remove").click(function(){
		multipleDataRemove(uniqueID)
	});
	clonedObject.find("[data-name]").each(function(){
		var inputID = target + uniqueID + $(this).attr("data-name");
		var dataType = $(this).attr("data-type");
		$(this).attr("id",inputID);
		$(this).prop("disabled",false);
		switch (dataType){
			case "date":
			createCalendar(inputID,new Date());
			break;
		}
		if ($(this).attr("data-validation")){
			$(this).attr("data-validation-optional","false");
		}
	});
	if (!jsonData){ scrollToView($("#" + uniqueID)); }
	if (jsonData){
		Object.keys(jsonData).forEach(function(key){
			var inputObject = $("[data-multiple='" + target + "']").find("#" + uniqueID).find("[data-name='" + key + "']");
			var dataType = inputObject.attr("data-type");
			switch (dataType){
				case "checkbox":
				inputObject.prop("checked",true);
				break;
				
				default:
				inputObject.val(jsonData[key]);
			}
			if (!inputObject.val() && inputObject.is("select")){
				inputObject.append("<option value='" + jsonData[key] + "'>" + jsonData[key] + "</option>").val(jsonData[key]);
			}
		});
	}
	var callbackFunction = window["onMultipleDataCreate_" + target];
	if (typeof callbackFunction === "function"){
		callbackFunction(clonedObject, jsonData);
	}
	return clonedObject;
}

function multipleDataRemove(uniqueID){
	$.confirm({
		title: "حذف",
		content: "هل انت متأكد من رغبتك في حذف هذه البيانات؟",
		icon: "fas fa-trash",
		animateFromElement: false,
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

function multipleDataBuild(){
	$("[data-multiple]").each(function(){
		var dataArray = [];
		$(this).find("[multiple-item]").each(function(){
			var dataObject = {};
			$(this).find("[data-name]").each(function(){
				if ($(this).attr("data-type")=="checkbox"){
					if ($(this).is(":visible") && $(this).prop("checked")){
						dataObject[$(this).attr("data-name")] = 1;
					}
				} else {
					dataObject[$(this).attr("data-name")] = $(this).val();
				}
			});
			dataArray.push(dataObject);
		});
		$(this).find("[name=" + $(this).attr("data-multiple") + "]").val((dataArray.length ? JSON.stringify(dataArray) : ""));
	});
}

$(document).ready(function() {
	$("[data-multiple]").each(function() {
		$(this).find("[multiple-sortable]").sortable({
			containment: $(this),
			handle: ($(this).find("[multiple-sortable] .handle").length ? ".handle" : false),
			stop: (e, ui) => {
				$(ui.item).find('textarea.mceEditor, textarea.mceEditorLimited, textarea[data-mce]').each((i, el) => {
					tinyMCE.triggerSave();
					tinymce.execCommand('mceRemoveEditor', false, $(el).attr('id'));
					tinymce.execCommand('mceAddEditor', true, $(el).attr('id'));
				});
			}
		});
	});
});