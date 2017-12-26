// Page Input

$(document).ready(function() {
	// function
	$("body").mLoading('show'); //Loading
	btnPropFn("showData");
	getLogin();

	$("#btnSearch").click(function() {
		$("#alertClose").alert('close'); // close Alert.
		btnPropFn("showData");
		clearFn();
		searchFn();
	});
	$("#btnAdd").click(function() {
		if (!numAdd) btnPropFn("addData");
		$("#allcheck").prop("disabled", true);
		$(".tr-get").hide();
		genTableAddFn();
	});
	$("#btnEdit").click(function() {
		$("#allcheck").prop("disabled", true);
		$(".tr-get").hide();
		genTableEditFn();
		btnPropFn("editData");
	});
	$("#btnDel").click(function() {
		deleteDataFn(checkboxArr);
		btnPropFn("showData");
		clearFn();
	});
	$("#btnCencel").click(function() {
		if (confirm("Do you want to cancel ?") == true){
		$(".tr-get").show(); // Show row class tr-get.
		$(".tr-add").remove(); // remove row class tr-add .
		$("#allcheck").prop("disabled", false);
		btnPropFn("showData");
		clearFn();
	}
});
	$("#btnSave").click(function() {
		if ($("#btnAdd").is(':enabled'))
			insertDataFn();
		else
			updateDataFn();
		getAutoCompleteFn()
	});
	$('[data-toggle="tooltip"]').tooltip();
});

var clearFn = function() {
	Empty = [];
	checkboxArr = [];
	editArr = [];
	numAdd = 0;
	addArr = [];
	idsame = [];

	$(".tr-add").remove();
	$(".tr-get").show();
	$("#allcheck").prop("checked", false);
	$("#allcheck").prop("disabled", false);
	$(".checkboxGet").prop("checked", false);
}

var searchFn = function() {
	$("#inputDataType").val($("#listShow").val());
	$("#inputKeySearch").val($("#tags").val());
	var select = $("#inputDataType").val();
	switch (select) {
		case "1":
		$("#DataTypeName").text("Entity Mapping");
		break;
		case "2":
		$("#DataTypeName").text("Counterpart Mapping");
		break;
		case "3":
		$("#DataTypeName").text("GL Account Mapping");
		break;
	}
	$("#alertClose").alert('close');
	if($("#listShow").val()){
		getDataFn();
		$("#DataTypePanel").show();
	}
		
}

var btnPropFn = function(status) {
	switch (status) {
		case "showData":
		$("#btnSave").prop("disabled", true);
		$("#btnCencel").prop("disabled", true);
		$("#btnEdit").prop("disabled", true);
		$("#btnDel").prop("disabled", true);
		$("#btnAdd").prop("disabled", false);
		break;
		case "addData":
		$("#btnSave").prop("disabled", true);
		$("#btnCencel").prop("disabled", false);
		$("#btnEdit").prop("disabled", true);
		$("#btnDel").prop("disabled", true);
		$("#btnAdd").prop("disabled", false);
		break;
		case "editData":
		$("#btnSave").prop("disabled", true);
		$("#btnCencel").prop("disabled", false);
		$("#btnEdit").prop("disabled", true);
		$("#btnDel").prop("disabled", true);
		$("#btnAdd").prop("disabled", true);
		break;
		case "checkboxData":
		$("#btnSave").prop("disabled", true);
		$("#btnCencel").prop("disabled", false);
		$("#btnEdit").prop("disabled", false);
		$("#btnDel").prop("disabled", false);
		$("#btnAdd").prop("disabled", true);
		break;
	}
}


function getLogin (){
	var	user_portlet  = $("#user_portlet").val();
	var	url_portlet   = $("#url_portlet").val();
	var	plid_portlet  = $("#plid_portlet").val();
	
	$("body").mLoading('show');    // Loading
	$.ajax({
		url : "http://" + host + "/api/public/login",
		type : "post",
		crossDomain : true,
		dataType : "json",
		data : {
			"user_portlet"  : user_portlet,
			"url_portlet" 	: url_portlet,
			"plid_portlet" 	: plid_portlet,
		},
		success : function(data) {
			if(data['status'] == 200){
				$("body").mLoading('hide');  // Loading
				getDataType();          // get data type
				getAutoCompleteFn(1);   // auto complete 1
				getAutoCompleteFn(2);   // auto complete 2
				getAutoCompleteFn(3); 	// auto complete 3
				$("#pageInput").show();
			}
			else {
					$("body").mLoading('hide'); //Loading
					alertFn("alert","Sorry! ","Change a few things up and try get data again.");
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				alertFn("alert alert-error","Sorry! ","Can not connect to server. (500)");
				$("body").mLoading('hide'); //Loading
			}
		})
}

var dataArr = [];
var getDataFn = function() {

	$("body").mLoading('show');  	 //Loading
	$.ajax({
		url : "http://" + host + "/api/public/input",
		type : "get",
		crossDomain : true,
		dataType : "json",
		data : {
			"insearch"  : $("#inputDataType").val(),
			"searchStr" : $("#inputKeySearch").val()
		},
		success : function(data) {
			if(data){
				dataArr = data;
				$("body").mLoading('hide'); // Loading
				genTableShowFn();
				clearFn();
			}
			else {
					$("body").mLoading('hide'); //Loading
					alertFn("alert","Sorry! ","Change a few things up and try get data again.");
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				alertFn("alert alert-error","Sorr! ","Can not connect to server. (500)");
				$("body").mLoading('hide'); //Loading
			}
		})
}

var getDataType = function() {
	$.ajax({
		url : "http://" + host + "/api/public/select",
		type : "get",
		crossDomain : true,
		dataType : "json",
		success : function(data) {
			if (data) {
					$("body").mLoading('hide'); //Loading
					genDataType(data);
				}
				else{
					$("body").mLoading('hide');
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				alertFn("alert alert-error","Sorry! ","Can not connect to server. (500)");
				$("body").mLoading('hide'); //Loading
			}
		})
}

var getAutoCompleteFn = function(select) {
	$.ajax({
		url : "http://" + host + "/api/public/select/complete",
		type : "get",
		crossDomain : true,
		dataType : "json",
		data : {
			"insearch" : select
		},
		success : function(data) {
			if(data){
				if (select == 1 && data) {
					AutoSearcMain = data;
					AutoSearch1 = data;
					selectDataSearchFn();
				} else if (select == 2 && data) {
					AutoSearch2 = data;
					selectDataSearchFn();
				} else if (select == 3 && data) {
					AutoSearch3 = data;
					selectDataSearchFn();
				}
			}
			else
				$("body").mLoading('hide');
		},
		error: function(jqXHR, textStatus, errorThrown){
			alertFn("alert alert-error","Sorry! ","Can not connect to server. (500)");
				$("body").mLoading('hide'); //Loading
			}
		})
	$("#tags").autocomplete(
	{
		minLength : 1,
		source : function(request, response) {
			var results = $.ui.autocomplete.filter(AutoSearcMain,
				request.term);
			response(results.slice(0, 10));
		}
	});
}

var deleteDataFn = function(delArr) {
	// console.log(delArr);
	if (confirm("Do you want to delete the data ?") == true){
		$("body").mLoading('show'); //Loading
		$.ajax({
			url : "http://" + host + "/api/public/input/del",
			type : "delete",
			crossDomain : true,
			dataType : "json",
			data : {
				"datas" : JSON.stringify(delArr)
			},
			success : function(data) {
				getAutoCompleteFn($("#inputDataType").val());
				if (data['status']==200) {
					$("body").mLoading('hide'); //Loading
					alertFn("alert alert-success", "Success! ","Delete successfully " + delArr.length + " record.");
					getDataFn();

				} else {
					$("body").mLoading('hide'); //Loading
					alertFn("alert","Sorry! ","Change a few things up and try delete again.");
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				alertFn("alert alert-error","Sorry! ","Can not connect to server. (500)");
				$("body").mLoading('hide'); //Loading
			}
		})
	}
}

var accountType = function(Product) {
	if (Product == "BS")
		return "BS";
	else
		return "PL";
}

var updateDataFn = function() {
	if (confirm("Want to save your changes to mapping data?") == true) {
		$("body").mLoading('show'); //Loading
		$.ajax({
			url : "http://" + host + "/api/public/input/edit",
			type : "patch",
			crossDomain : true,
			dataType : "json",
			data : {
				"datas" : JSON.stringify(editArr)
			},
			success : function(data) {
				getAutoCompleteFn($("#inputDataType").val());
				if (data['status'] == 200) {
					getDataFn();
					alertFn("alert alert-success", "Success! ","Update successfully " + editArr.length + " record.");
					clearFn();
					btnPropFn("showData");
				} else if(data['status'] == 400){
					$("#btnSave").prop("disabled", true);
					$("body").mLoading('hide'); //Loading
					alertFn("alert","Sorry! ","You can not update data. Because there is duplicate data.");
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				alertFn("alert alert-error","Sorry! ","Can not connect to server. (500)");
				$("body").mLoading('hide'); //Loading
			}
		})
	} 
}

var insertDataFn = function() {
// console.log(JSON.stringify(addArr));

if (addArr.length) {
		$("body").mLoading('show'); //Loading
		$.ajax({
			url : "http://" + host + "/api/public/input/add",
			type : "post",
			crossDomain : true,
			dataType : "json",
			data : {
				"datas" : JSON.stringify(addArr)
			},
			success : function(data) {
				getAutoCompleteFn($("#inputDataType").val());
				if (data['status'] == 200){
					alertFn("alert alert-success", "Success! ", "Insert successfully " + addArr.length + " record.");
					getDataFn();
					btnPropFn("showData");
				} 
				else if(data['status'] == 400){
					$("#btnSave").prop("disabled", true);
					$("body").mLoading('hide'); //Loading
					alertFn("alert","Sorry! ","You can not add data. Because there is duplicate data.");
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				alertFn("alert alert-error","Sorry! ","Can not connect to server. (500)");
				$("body").mLoading('hide'); //Loading
			}
		})
	}
	else{
		$("#btnSave").prop("disabled", true);
		alertFn("alert", "Warning! ", "Please enter your information.");
	}
}

var AutoSearch1 = []; /* Entity Search */
var AutoSearch2 = []; /* Couterpart Search */
var AutoSearch3 = []; /* GL Search */
var AutoSearcMain = []; /* AutoSearcMain */

function selectDataSearchFn() {
	if ($("#listShow").val() == 1)
		AutoSearcMain = AutoSearch1;
	else if ($("#listShow").val() == 2)
		AutoSearcMain = AutoSearch2;
	else if ($("#listShow").val() == 3)
		AutoSearcMain = AutoSearch3;
	// console.log(JSON.stringify(AutoSearcMain));
	$('button[id="btnSearch"]').focus();
}

var genDataType = function(data) {
	htmlOption = "";
	$.each(data, function(index, indexEntry) {
		htmlOption += "<option value=" + indexEntry['entity_type_id'] + ">"
		+ indexEntry['entity_type_name'] + "</option>";
	});
	$("#listShow").html(htmlOption);
}

var numAdd = 0;
var genTableAddFn = function() {   
	var html = ""; // add row text input (html)
	html += "<tr class='tr-add'> ";
	html += "<td><label>&emsp;<input disabled='true' class='checkboxAdd' type='checkbox'></label></td>";
	html += "<td><input placeholder='ERP ("+(numAdd+1)+")' name ='AddERP-"+ numAdd+"' style='margin-bottom: 0px; width:90%'  onchange='emptyEvent(this)' id='AddERP-" + numAdd+ "' type='text'></td>";
	html += "<td><input placeholder='HFM ("+(numAdd+1)+")' style='margin-bottom: 0px; width:90%'  onchange='emptyEvent(this)' id='AddHFM-" + numAdd+ "'type='text'></td>";
	if ($("#inputDataType").val() == 3){ // Add Columen Product(Data Type 3).
		html += "<td><input   placeholder='Custom1 ("+(numAdd+1)+")' style='margin-bottom: 0px; width:90%' onchange='emptyEvent(this)' id='AddProduct-" + numAdd+ "'type='text'></td>";
		html += "<td><input   placeholder='FS Line ("+(numAdd+1)+")' style='margin-bottom: 0px; width:90%' onchange='emptyEvent(this)' id='AddFS_Line-" + numAdd+ "'type='text'></td>";
		html += "<td><input   placeholder='Note ("+(numAdd+1)+")' style='margin-bottom: 0px; width:90%' onchange='emptyEvent(this)' id='AddNote-" + numAdd+ "'type='text'></td>";
	}
	html += "</tr>";
	$("#bodyTable").append(html);
	$('input[name="AddERP-'+numAdd+'"]').focus()
	numAdd += 1;

}

var genTableEditFn = function() {
	var html = " ";
	$.each(checkboxArr,function(index, indexEntry) { 
		var ERP = $("#ERP-" + indexEntry['id']).text();
		var HFM = $("#HFM-" + indexEntry['id']).text();
		var Product = $("#Product-" + indexEntry['id']).text();
		var FS_Line = $("#FS_Line-" + indexEntry['id']).text();
		var Note = $("#Note-" + indexEntry['id']).text();
		html += "<tr class='tr-add'>";
		html += "<td><label>&emsp;<input disabled='true' checked class='checkboxGet' type='checkbox'></label></td>";
		html += '<td><input disabled="true" style="margin-bottom: 0px; width:90%;" onchange="emptyEvent(this)" type="text" id="AddERP-'+ indexEntry['id'] + '" value=' + ERP+ '></td>';
		html += '<td><input style="margin-bottom: 0px; width:90%;" onchange="emptyEvent(this)"type="text" id="AddHFM-'+ indexEntry['id'] + '" value=' + HFM+ '></td>';
		if ($("#inputDataType").val() == 3){ // Edit Columen
			html += '<td><input style="margin-bottom: 0px; width:90%" onchange="emptyEvent(this)" type="text" id="AddProduct-'+ indexEntry['id'] + '" value=' + Product+ '></td>';
			html += '<td><input style="margin-bottom: 0px; width:90%" onchange="emptyEvent(this)" type="text" id="AddFS_Line-'+ indexEntry['id'] + '" value=' + FS_Line+ '></td>';
			html += '<td><input style="margin-bottom: 0px; width:90%" onchange="emptyEvent(this)" type="text" id="AddNote-'+ indexEntry['id'] + '" value=' + Note+ '></td>';
		}
		html += "</tr>";
	});
	$("#bodyTable").append(html);
}

var genTableShowFn = function() {
	var htmlHead = "";
	var htmlBody = "";
	if ($("#inputDataType").val() == 1) {
		htmlHead += '<th><label>&emsp;';
		htmlHead += '<input type="checkbox" id="allcheck" >';
		htmlHead += '</label></th>';
		htmlHead += '<th>ERP Entity Code</th>';
		htmlHead += '<th>HFM Entity Code</th>';
		$("#headTable").html(htmlHead);
		$.each(dataArr,function(index, indexEntry) {
			htmlBody += '<tr id="tr-'+ indexEntry['mapping_data_id']+'" class="tr-get">';
			htmlBody += '<td><label>&emsp;<input onchange="checkboxEven(this)" class="checkboxGet" type="checkbox" id="'+ indexEntry['mapping_data_id'] + '"></label</td>';
			htmlBody += '<td id="ERP-'+ indexEntry['mapping_data_id']+'">'+ indexEntry['source_code'] + '</td>';
			htmlBody += '<td id="HFM-'+ indexEntry['mapping_data_id']+'">'+ indexEntry['target_code1'] + '</td>';
			htmlBody += "</tr>";
		});
		$("#bodyTable").html(htmlBody);

	} else if ($("#inputDataType").val() == 2) {
		htmlHead += '<th ><label>&emsp;';
		htmlHead += '<input type="checkbox" id="allcheck" >';
		htmlHead += '</label></th>';
		htmlHead += '<th>ERP Counterpart</th>';
		htmlHead += '<th>HFM Counterpart</th>';
		$("#headTable").html(htmlHead);
		$.each(dataArr,function(index, indexEntry) {
			htmlBody += '<tr id="tr-'+indexEntry['mapping_data_id']+'" class="tr-get" >';
			htmlBody += '<td><label>&emsp;<input onchange="checkboxEven(this)" class="checkboxGet" type="checkbox" id='+indexEntry['mapping_data_id'] + '><label></td>';
			htmlBody += '<td id="ERP-'+indexEntry['mapping_data_id']+'">'+indexEntry['source_code']+'</td>';
			htmlBody += '<td id="HFM-'+indexEntry['mapping_data_id']+'">'+indexEntry['target_code1']+'</td>';
			htmlBody += "</tr>";
		});
		$("#bodyTable").html(htmlBody);
	} else {
		htmlHead += '<th ><label>&emsp;';
		htmlHead += '<input type="checkbox" id="allcheck" >';
		htmlHead += '</label></th>';
		htmlHead += '<th>ERP Account</th>';
		htmlHead += '<th>HFM Account</th>';
		htmlHead += '<th>Custom1</th>';
		htmlHead += '<th>FS Line</th>';
		htmlHead += '<th>Note</th>';
		$("#headTable").html(htmlHead);
		$.each(dataArr,function(index, indexEntry) {
			htmlBody += '<tr id="tr-'+indexEntry['mapping_data_id']+ '" class="tr-get">';
			htmlBody += '<td><label>&emsp;<input onchange="checkboxEven(this)" class="checkboxGet" type="checkbox" id="'+ indexEntry['mapping_data_id'] + '"></label></td>';
			htmlBody += '<td id="ERP-'+indexEntry['mapping_data_id']+ '">'+ indexEntry['source_code'] + '</td>';
			htmlBody += '<td id="HFM-'+indexEntry['mapping_data_id']+ '">'+ indexEntry['target_code1'] + '</td>';
			htmlBody += '<td id="Product-'+indexEntry['mapping_data_id']+ '">'+ indexEntry['target_code2'] + '</td>';
			htmlBody += '<td id="FS_Line-'+indexEntry['mapping_data_id']+ '">'+ indexEntry['fs_line'] + '</td>';
			htmlBody += '<td id="Note-'+indexEntry['mapping_data_id']+ '">'+ indexEntry['note'] + '</td>';
			htmlBody += "</tr>";
		});
		$("#bodyTable").html(htmlBody);
	}

	$("#allcheck").click(function() { // all check box function.
		checkboxArr = [];
		if ($(this).prop("checked")) {
			$(".checkboxGet").prop("checked", true);
			$.each(dataArr, function(index, indexEntry) {
				checkboxArr.push({
					"id" : indexEntry['mapping_data_id']
				});
			});
			btnPropFn("checkboxData");
		} else {
			$(".checkboxGet").prop("checked", false);
			btnPropFn("showData");
		}
		console.log('Check Box->'+JSON.stringify(checkboxArr));
	});
}

var subSpacesFn = function(str) {
	var newStr = 0;
	if (str)
		newStr = str.split(' ').join('');
	return (newStr.length);
}

var Empty = []; // variable for save id empty input.
// function check empty text input
var emptyEvent = function($event) {
	var ID = $event.id.substr($event.id.search("-") + 1, $event.id.length);
	var HFM = subSpacesFn($("#AddHFM-" + ID).val());
	var ERP = subSpacesFn($("#AddERP-" + ID).val());
	var Product = subSpacesFn($("#AddProduct-" + ID).val());

// -------------------button save --------------
	if (HFM && ERP && Product) // Add and Edit
		Empty = $.grep(Empty, function(data, index) {
			return data.id != ID;
		});
	else if (HFM && ERP && $("#inputDataType").val() != 3) // Add and Edit
		Empty = $.grep(Empty, function(data, index) {
			return data.id != ID;
		});
	else if (HFM || ERP || Product) // Add and Edit
		Empty.push({"id" : ID});
	else if (!HFM && !ERP && !$("#btnAdd").is(':enabled')) // Edit
		Empty.push({"id" : ID});
	else if (!HFM && !ERP && !Product && !$("#btnAdd").is(':enabled')) // Edit
		Empty.push({"id" : ID});
	else // Add 
		Empty = $.grep(Empty, function(data, index) {
			return data.id != ID;
		});
// ----------------- focus text input ----------------------
if (!HFM)
	$("#AddHFM-" + ID).addClass('borderRed');
else
	$("#AddHFM-" + ID).removeClass('borderRed');

if (!ERP)
	$("#AddERP-" + ID).addClass('borderRed');
else
	$("#AddERP-" + ID).removeClass('borderRed');

if (!Product)
	$("#AddProduct-" + ID).addClass('borderRed');
else
	$("#AddProduct-" + ID).removeClass('borderRed');
// ------------------ button save .----------------------------

checkdoubly(addArr,ID);   // check value doubly

if (!$("#btnAdd").is(':enabled'))  editEvent(ID);
else  addEvent(ID);

if (!Empty.length && !idsame.length) $("#btnSave").prop("disabled", false);
else $("#btnSave").prop("disabled", true);

}
var idsame = [];
var checkdoubly = function(dataArr,ID){
	var arrSame = [];
	arrSame = $.grep(dataArr, function(data, index) {
		return data.source == $("#AddERP-" + ID).val() && data.id!=ID;
	});

	idsame = $.grep(idsame, function(data, index) {
		return data.id != ID
	});
	if(arrSame.length){

		alertFn("alert","Sorry! ","You can not save data.Because there is doubly data.");
		$("#AddERP-" + ID).addClass('borderRed');
		idsame.push({"id" : ID,});
	}
	console.log(idsame.length);
	return arrSame.length;
}

var addArr = [];
var addEvent = function(id){

	addArr = $.grep(addArr, function(data, index) {
		return data.id != id;
	});
	if (!checkdoubly(addArr,id)&& $("#inputDataType").val() == 3 && $("#AddERP-" + id).val() && $("#AddHFM-" + id).val() && $("#AddProduct-" + id).val()) {
		addArr.push({
			"id" : id,
			"type" : $("#inputDataType").val(),
			"account" : accountType($("#AddProduct-" + id).val()),
			"source" : $("#AddERP-" + id).val(),
			"target1" : $("#AddHFM-" + id).val(),
			"target2" : $("#AddProduct-" + id).val(),
			"fs_line" : $("#AddFS_Line-" + id).val(),
			"note" 	  : $("#AddNote-" + id).val(),
			"create_by" : $("#user_portlet").val(),
			"update_by" : $("#user_portlet").val(),
		});
	}
	else if (!checkdoubly(addArr,id)&& $("#AddERP-" + id).val() && $("#AddHFM-" + id).val()&& $("#inputDataType").val() != 3 ) {
		addArr.push({
			"id" : id,
			"type" : $("#inputDataType").val(),
			"account" : null,
			"source" : $("#AddERP-" + id).val(),
			"target1" : $("#AddHFM-" + id).val(),
			"target2" : null,
			"fs_line" : null,
			"note" : null,
			"create_by" : $("#user_portlet").val(),
			"update_by" : $("#user_portlet").val(),
		});
	}
	console.log('Add-> '+JSON.stringify(addArr));
}


var checkboxArr = []; // variable for save id checkbox.
var checkboxEven = function($this) {  // function input check Box.
	$("#allcheck").prop("checked", false);
	if ($($this).prop("checked")) {
		checkboxArr.push({
			"id" : $this.id
		});
		btnPropFn("checkboxData");
	} else {
		checkboxArr = $.grep(checkboxArr, function(data, index) {
			return data.id != $this.id;
		});
	}
	if (!checkboxArr.length) {
		btnPropFn("showData");
	}
	console.log(JSON.stringify(checkboxArr));
}

var editArr = [];
var editEvent = function(ID) {
	var account = null;
	var target2 = null;
	var FS_Line = null;
	var Note = null;

	editArr = $.grep(editArr, function(data, index) {
		return data.id != ID;
	});

	if ($("#inputDataType").val() == 3) {
		target2 = $("#AddProduct-" + ID).val();
		account = accountType($("#AddProduct-" + ID).val());
		FS_Line = $("#AddFS_Line-" + ID).val();
		Note = $("#AddNote-" + ID).val();
	}
	if ($("#AddHFM-" + ID).val() && $("#AddERP-" + ID).val()
		&& ($("#AddProduct-" + ID).val() || $("#inputDataType").val() != 3)) {
		editArr.push({
			"id" : ID,
			"source" : $("#AddERP-" + ID).val(),
			"target1" : $("#AddHFM-" + ID).val(),
			"target2" : target2,
			"account" : account,
			"updateby" : "Mr.Daris",
			"fs_line" : FS_Line,
			"note" : Note,
			"update_by" : $("#user_portlet").val(),
		});
}
// console.log('Edit-> '+JSON.stringify(editArr));
}

var alertFn = function(classAlert, head, txtSt) {
	var html = "";
	html += '<div class="' + classAlert + '" style="margin-bottom: 0px;" id="alertClose">';
	html += '<button type="button" class="close" data-dismiss="alert">&times;</button>';
	html += '<strong >' + head + '</strong> ' + txtSt + '';
	html += '</div>';
	$("#strAlert").html(html);
}