$(document).ready(function(){
// function
$("#btnSearch").prop("disabled",true);
getLogin();
//------------tool tip----------------
$('[data-toggle="tooltip"]').tooltip();

//------------accordion----------------
$('.accordion').accordion({  
	"transitionSpeed": 400
});

//---------- all check box ---------------
$("#allCheck").click(function(){ 
	checkboxArr = [];
	if($(this).prop("checked")){ 
		$(".checkboxGet").prop("checked",true);
		btnPropFn("checkboxData");
		$.each(dataArr,function(index,indexEntry){		
			checkboxArr.push({"id" : indexEntry['target_tb_id'],});
		});
	}else{ 
		$(".checkboxGet").prop("checked",false); 
		btnPropFn("showData");
	}
	console.log('Check Box->'+JSON.stringify(checkboxArr));
});

//-------- Check all Button --------
$("#btnSearch").click(function(){
	$("#alertClose").alert('close');
	$("body").mLoading('show');
	btnsearchFn();
	btnPropFn("showData");
	clearFn();
});
$("#btnAdd").click(function(){
	action ='add';
	$(".tr-GET").hide();
	GenTableAdd();
	btnPropFn("addData");
});
$("#btnSave").click(function(){
	if(action == 'edit') updateDataFn();
	else if(action == 'add') insertDataFn();
});
$("#btnDel").click(function(){
	deleteDataFn();
});
$("#btnEdit").click(function(){
	action ='edit';
	$(".tr-GET").hide();
	GenTableEdit();
	btnPropFn("editData");
});
$("#btnCencel").click(function(){
	if (confirm("Do you want to cancel ?") == true){
		$(".tr-GET").show();
		clearFn(); 
	}
});

}); //--------------------------> End $(document).ready

function eventInput(){   // Event input
		$('button[id="btnSearch"]').focus();
}

var action = '';
var btnPropFn = function(status){
	switch(status) {
		case "showData":
		$("#allCheck").prop("disabled",false);
		$("#btnSave").prop("disabled",true);
		$("#btnCencel").prop("disabled",true);
		$("#btnEdit").prop("disabled",true);
		$("#btnDel").prop("disabled",true);
		$("#btnAdd").prop("disabled",false); break;
		case "addData":
		$("#alertClose").alert('close');
		$("#allCheck").prop("disabled",true);
		$("#btnSave").prop("disabled",true);
		$("#btnCencel").prop("disabled",false);
		$("#btnEdit").prop("disabled",true);
		$("#btnDel").prop("disabled",true);
		$("#btnAdd").prop("disabled",true); break;
		case "editData":
		$("#alertClose").alert('close');
		$("#allCheck").prop("disabled",true);
		$("#btnSave").prop("disabled",true);
		$("#btnCencel").prop("disabled",false);
		$("#btnEdit").prop("disabled",true);
		$("#btnDel").prop("disabled",true);
		$("#btnAdd").prop("disabled",true); break;
		case "checkboxData":
		$("#btnSave").prop("disabled",true);
		$("#btnCencel").prop("disabled",false);
		$("#btnEdit").prop("disabled",false);
		$("#btnDel").prop("disabled",false);
		$("#btnAdd").prop("disabled",true); break;
	} 
}

var clearFn= function(){
// clear variable 	
action  	 ='';
Empty   	 = [];
editArr 	 = [];
checkboxArr  = [];

// clear function
btnPropFn("showData");
$(".checkboxGet").prop("checked",false);
$("#allCheck").prop("checked",false);
$(".tr-add").remove();
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
				$("#btnSearch").prop("disabled",false);
				btnPropFn("showData");      // button 
				getEntity();			    // Get entity and year.
				$("#pageOutput").show();
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

var btnsearchFn =function(){
	if($("#selectEntity").val()&&$("#selectYear").val()&&$("#selectMonth").val())
		$("#panel").show();
	
	$("#inputEntity").val($("#selectEntity").val()); 
	$("#inputYear").val($("#selectYear").val());  
	$("#inputMonth").val($("#selectMonth").val());

	$("#showYear").text($("#inputYear").val());   // show detail
	$("#showMonth").text($('#selectMonth option:selected').text()); // show detail
	getDataFn(); // get data.
}
var getMonth = function(){
	$("body").mLoading('show');  // Loading
	var html="";
	$.ajax({
		url:"http://"+host+"/api/public/month",
		type:"get",
		crossDomain: true,
		dataType:"json",
		success:function(data){ 
			$.each(data,function(index,indexEntry){
				html+='<option value="'+indexEntry['month_name']+'">'+indexEntry['month_name']+'</option>';			
			});
			$("#selectMonth").html(html);
			$("body").mLoading('hide');
		},
		error: function(jqXHR, textStatus, errorThrown){
			alertFn("alert alert-error","Sorry! ","Can not connect to server. (500)");
			$("body").mLoading('hide'); //Loading
		}
	})
}

var getYear = function(){
	$("body").mLoading('show');  // Loading
	var html="";
	$.ajax({
		url:"http://"+host+"/api/public/year",
		type:"get",
		crossDomain: true,
		dataType:"json",
		success:function(data){ 
			$("body").mLoading('hide');  // Loading
			getMonth();
			$.each(data,function(index,indexEntry){
				html+='<option value="'+indexEntry['fiscal_year']+'">'+indexEntry['fiscal_year']+'</option>';			
			});
			$("#selectYear").html(html);
		},
		error: function(jqXHR, textStatus, errorThrown){
			alertFn("alert alert-error","Sorry! ","Can not connect to server. (500)");
			$("body").mLoading('hide'); //Loading
		}
	})
}

var getEntity = function(){
	var html="";
	$("body").mLoading('show');  // Loading
	$.ajax({
		url:"http://"+host+"/api/public/entity",
		type:"get",
		crossDomain: true,
		dataType:"json",
		success:function(data){ 
			$("body").mLoading('hide');  // Loading
			getYear();
			$.each(data,function(index,indexEntry){
				html+='<option value="'+indexEntry['entity_code']+'">'+indexEntry['entity_code']+'</option>';			
			});
			$("#selectEntity").html(html);
		},
		error: function(jqXHR, textStatus, errorThrown){
			alertFn("alert alert-error","Sorry! ","Can not connect to server. (500)");
			$("body").mLoading('hide'); //Loading
		}
	})
}

var dataArr = [];
var getDataFn = function(){
	$("body").mLoading();
	$.ajax({
		url:"http://"+host+"/api/public/output",
		type:"get",
		crossDomain: true,
		dataType:"json",
		data:{
			"entity" 	:$("#inputEntity").val(),
			"year"		:$("#inputYear").val(),
			"month"	    :$("#inputMonth").val()
		},
		success:function(data){
			getEndingbalance();
			dataArr = data;
			GenTableShow();
			$("body").mLoading('hide');
		},
		error: function(jqXHR, textStatus, errorThrown){
			alertFn("alert alert-error","Sorry! ","Can not connect to server. (500)");
			$("body").mLoading('hide'); //Loading
		}
	})	
}

var insertDataFn = function(){
	var addArr = [];
	addArr.push({
		"year"		 : $("#inputYear").val(),
		"month"		 : $("#inputMonth").val(),
		"entity"	 : $("#inputEntity").val(),
		"account"	 : $("#Addaccount-1").val(),
		"counterpart": $("#Addcounterpart-1").val(),
		"custom"	 : $("#Addcustom1-1").val(),
		"net_amount" : $("#Addending-1").val(),		
		"update_by"  : $("#user_portlet").val(),
		"create_by"  : $("#user_portlet").val(),
	});
	console.log(JSON.stringify(addArr));
	if (confirm("Do you want to insert data ?") == true) {
		$("body").mLoading('show');
		$.ajax({
			url:"http://"+host+"/api/public/output/add",
			type:"post",
			crossDomain: true,
			dataType:"json",
			data:{"datas":JSON.stringify(addArr)},
			success:function(data){ 
				if(data['status'] == 200){
					getDataFn();
					clearFn();
					alertFn("alert alert-success","Success! ","Insert successfully.");
				}
				else if(data['status'] == 400){
					$("#btnSave").prop("disabled", true);
					$("body").mLoading('hide'); //Loading
					alertFn("alert","Sorry! ","You can not add data. Because there is duplicate data.");
				}
				else if(data['status'] == 401 ){
					$("#btnSave").prop("disabled", true);
					$("body").mLoading('hide'); //Loading
					alertFn("alert","Sorry! ","You can not add data. Because '"+data['data']+"' is not data. ");
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				alertFn("alert alert-error","sorry! ","Can not connect to server. (500)");
				$("body").mLoading('hide'); //Loading
			}
		})
	}
}

var deleteDataFn = function(){
	if (confirm("Do you want to delete data ?") == true) {
		$("body").mLoading('show');
		$.ajax({
			url:"http://"+host+"/api/public/output/del",
			type:"delete",
			crossDomain: true,
			dataType:"json",
			data:{ "datas" : JSON.stringify(checkboxArr),},
			success:function(data){
				if(data){
					alertFn("alert alert-success","Success! ","Delete successfully "+checkboxArr.length+" record.");
					clearFn();
					getDataFn();
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				alertFn("alert alert-error","Sorry! ","Can not connect to server. (500)");
				$("body").mLoading('hide'); //Loading
			}
		})
	}	
}

var updateDataFn =function(){
	if (confirm("Do you want to chang data ?") == true) {
		$("body").mLoading('show');
		$.ajax({
			url:"http://"+host+"/api/public/output/edit",
			type:"patch",
			crossDomain: true,
			dataType:"json",
			data:{"datas":JSON.stringify(editArr)},
			success:function(data){ 
				if(data['status'] == 200){
					$("body").mLoading('hide');
					alertFn("alert alert-success","Success! ","Update successfully "+editArr.length+" record.");
					clearFn();
					getDataFn();
				}
				else if(data['status'] == 400){
					$("#btnSave").prop("disabled", true);
					$("body").mLoading('hide'); //Loading
					alertFn("alert","Sorry! ","You can not add data. Because there is duplicate data.");
				}
				else if(data['status'] == 401 ){
					$("#btnSave").prop("disabled", true);
					$("body").mLoading('hide'); //Loading
					alertFn("alert","Sorry! ","You can not add data. Because '"+data['data']+"' in "+data['type']+" is not data.");
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				alertFn("alert alert-error","Sorry! ","Can not connect to server. (500)");
				$("body").mLoading('hide'); //Loading
			}
		})	
	}
}


var GenTableShow = function(){
	var month ="";
	var year  ="";
	var html  ="";

	$.each(dataArr,function(index,indexEntry){

		var net_amount_color = '#555';
		var updated_dttm_color ="#555";

		if (indexEntry['net_amount'].substr(0,1) == "-") net_amount_color = '#ff3300';   // net_amount color
		if (indexEntry['updated_dttm'] != indexEntry['created_dttm']) updated_dttm_color ='#0000e6';  // updated_dttm
		// console.log("date ->"+indexEntry['created_dttm']+indexEntry['updated_dttm']);

		html+='<tr class="tr-GET">';
		html+='<td> <label>&emsp;<input  class="checkboxGet" type="checkbox" id='+indexEntry['target_tb_id']+' onchange="checkboxEven(this)"></label> </td>';
		html+='<td  id="entity-'+indexEntry['target_tb_id']+'">'+indexEntry['entity_code']+'</td>';
		html+='<td  id="account-'+indexEntry['target_tb_id']+'">'+indexEntry['account_code']+'</td>';
		html+='<td  id="counterpart-'+indexEntry['target_tb_id']+'">'+indexEntry['counterpart']+'</td>';
		html+='<td  id="custom1-'+indexEntry['target_tb_id']+'">'+indexEntry['custom']+'</td>';
		html+='<td><div id="net_amount-'+indexEntry['target_tb_id']+'" style="color: '+net_amount_color+'; float:left;  width:90%"><div style="float:right">'+formatCurrency(indexEntry['net_amount'])+'&emsp;</div></div></td>';
		html+='<td  id="created_by-'+indexEntry['target_tb_id']+'">'+indexEntry['created_by']+'</td>';
		html+='<td  id="created_dttm-'+indexEntry['target_tb_id']+'">'+indexEntry['created_dttm']+'</td>';
		html+='<td  id="updated_by-'+indexEntry['target_tb_id']+'">'+indexEntry['updated_by']+'</td>';
		html+='<td  id="updated_dttm-'+indexEntry['target_tb_id']+'" style="color:'+updated_dttm_color+';" >'+indexEntry['updated_dttm']+'</td>';
		html+="</tr>";				
	});
	$("#ShowTbody").html(html);
}

var GenTableAdd = function(){
	var html  ="";
	html+='<tr class="tr-add">';
	html+='<td><label>&emsp;<input disabled="true"  class="checkboxGet" type="checkbox"></label></td>';
	html+='<td id="entity-addID">'+$("#inputEntity").val()+'</td>';
	html+='<td> <input  name="Addaccount-1" style="width: 90%;"  class="tagsAccount" type="text" id="Addaccount-1" onchange="emptyEvent(this)"></input> </td>';
	html+='<td> <input  style="width: 90%;"  class="tagsCounterpart" type="text" id="Addcounterpart-1" onchange="emptyEvent(this)"></input> </td>';
	html+='<td> <input  style="width: 90%;"  class="tagsCustom1" type="text" id="Addcustom1-1" onchange="emptyEvent(this)"></input> </td>';
	html+='<td> <input  style="width: 90%;"  type="number" value="0.00" step="0.01" id="Addending-1" onchange="emptyEvent(this)"></input></td>';
	html+='<td> &emsp; - </td>';
	html+='<td> &emsp; - </td>';
	html+='<td> &emsp; - </td>';
	html+='<td> &emsp; - </td>';
	html+="</tr>";				
	$("#ShowTbody").append(html);
	$('input[name="Addaccount-1"]').focus();
	getAutocomplete('account'); getAutocomplete('counterpart'); getAutocomplete('custom1');
}

var GenTableEdit = function(){
	var html="";   
	$.each(checkboxArr,function(index,indexEntry){   
		var entity  =  $("#inputEntity").val()
		var account =  $("#account-"+indexEntry['id']).text();
		var counterpart = $("#counterpart-"+indexEntry['id']).text();
		var custom1 = $("#custom1-"+indexEntry['id']).text();
		var net_amount = $("#net_amount-"+indexEntry['id']).text();
		var created_by = $("#created_by-"+indexEntry['id']).text();
		var created_dttm = $("#created_dttm-"+indexEntry['id']).text();
		var updated_by = $("#updated_by-"+indexEntry['id']).text();
		var updated_dttm = $("#updated_dttm-"+indexEntry['id']).text();
		var updated_dttm_color ="#555";

		if (updated_dttm != created_dttm ) updated_dttm_color ='#0000e6';  // updated_dttm

		html+='<tr class="tr-add">';
		html+='<td><label>&emsp;<input disabled="true" checked class="checkboxGet" type="checkbox"></label></td>';
		html+='<td id="entity-'+indexEntry['id']+'">'+entity+'</td>';
		html+='<td> <input style="width: 90%;" class="tagsAccount" type="text" id="Addaccount-'+indexEntry['id']+'" value="'+account+'" onchange="emptyEvent(this)"></input> </td>';
		html+='<td> <input style="width: 90%;" class="tagsCounterpart" type="text" id="Addcounterpart-'+indexEntry['id']+'" value="'+counterpart+'" onchange="emptyEvent(this)" ></input> </td>';
		html+='<td> <input style="width: 90%;" class="tagsCustom1" type="text" id="Addcustom1-'+indexEntry['id']+'" value="'+custom1+'" onchange="emptyEvent(this)" ></input> </td>';
		html+='<td> <input style="width: 90%;" type="number" id="Addending-'+indexEntry['id']+'"  step="0.01" value="'+subNumberFn(net_amount)+'" onchange="emptyEvent(this)" ></input></td>';
		html+='<td>'+created_by+'</td>';
		html+='<td>'+created_dttm+'</td>';
		html+='<td>'+updated_by+'</td>';
		html+='<td style="color:'+updated_dttm_color+';" >'+updated_dttm+'</td>';
		html+="</tr>";				
	});
	$("#ShowTbody").append(html);
	getAutocomplete('account'); getAutocomplete('counterpart'); getAutocomplete('custom1');
	
}

var subSpacesFn = function(str) {
	var newStr = 0;
	if (str) newStr = str.split(' ').join('');
	return (newStr.length);
}

var subNumberFn = function(str) {
	var newStr = '';
	if (str) newStr = str.trim(str).split(',').join('');
	return (newStr);
}

var Empty = [];  // variable for save id empty input.
// function check empty text input
var emptyEvent = function($event){
	var ID = $event.id.substr($event.id.search("-")+1,$event.id.length);
	var account = subSpacesFn($("#Addaccount-"+ID).val());
	var counterpart = subSpacesFn($("#Addcounterpart-"+ID).val());
	var custom1 = subSpacesFn($("#Addcustom1-"+ID).val());
	var ending = subSpacesFn($("#Addending-"+ID).val());
	console.log('-->'+account+','+counterpart+','+custom1+','+ending);
	conditionTextinput(ID);  // check text input.

	if(account && counterpart && custom1 && ending)   // Add and Edit
		Empty = $.grep(Empty, function(data, index) {
			return data.id != ID;
		});
	else if(account || counterpart || custom1 || ending){ // Add and Edit
		Empty = $.grep(Empty, function(data, index) {
			return data.id != ID;
		});

		Empty.push({ "id" : ID});
	}
	else if(!account && !counterpart && !custom1 && !ending&& !$("#btnAdd").is(':enabled'))  // Edit
		Empty.push({ "id" : ID}); 	 

	if(!Empty.length )  // Check text input.  for edit and add.
		$("#btnSave").prop("disabled",false); 
	else
		$("#btnSave").prop("disabled",true); 

	if(action == 'edit')  
editEvent(ID); // add to variable editArr

console.log("Empty->"+JSON.stringify(Empty));
}

var conditionTextinput = function(id) {
	var account = subSpacesFn($("#Addaccount-"+id).val());
	var counterpart = subSpacesFn($("#Addcounterpart-"+id).val());
	var custom1 = subSpacesFn($("#Addcustom1-"+id).val());
	var ending = subSpacesFn($("#Addending-"+id).val());

	if (!account) $("#Addaccount-"+ id).css({'border-color': '#e9322d', 'box-shadow': '0 0 6px #f8b9b7'});
	else $("#Addaccount-"+ id).css({'border-color': '', 'box-shadow': ''});

	if (!counterpart) $("#Addcounterpart-"+ id).css({'border-color': '#e9322d', 'box-shadow': '0 0 6px #f8b9b7'});
	else $("#Addcounterpart-"+ id).css({'border-color': '', 'box-shadow': ''});

	if (!custom1) $("#Addcustom1-" + id).css({'border-color': '#e9322d', 'box-shadow': '0 0 6px #f8b9b7'});
	else $("#Addcustom1-"+ id).css({'border-color': '', 'box-shadow': ''});

	if (!ending) $("#Addending-" + id).css({'border-color': '#e9322d', 'box-shadow': '0 0 6px #f8b9b7'});
	else $("#Addending-"+ id).css({'border-color': '', 'box-shadow': ''});
}

var editArr = [];
var editEvent = function(ID){
	editArr = $.grep(editArr, function(data, index) {
		return data.id != ID;
	});
	var account = subSpacesFn($("#Addaccount-"+ID).val());
	var counterpart = subSpacesFn($("#Addcounterpart-"+ID).val());
	var custom1 = subSpacesFn($("#Addcustom1-"+ID).val());
	var ending = subSpacesFn($("#Addending-"+ID).val());

	if(account && counterpart && custom1 && ending ){
		editArr.push({
			"account"	 : $("#Addaccount-"+ID).val(),
			"counterpart": $("#Addcounterpart-"+ID).val(),
			"custom"	 : $("#Addcustom1-"+ID).val(),
			"net_amount" : $("#Addending-"+ID).val(),	
			"id"  		 : ID,		
			"update_by"  : $("#user_portlet").val(),
		});
	}
	console.log("EditArr->"+JSON.stringify(editArr));
}

var checkboxArr = [];
var checkboxEven = function($this){
	if($($this).prop("checked")){
		checkboxArr.push({"id" : $this.id, });
	}
	else{
		checkboxArr = $.grep(checkboxArr, function(data, index) {
			return data.id != $this.id;
		});
	}
	if(!checkboxArr.length) btnPropFn("showData");
	else btnPropFn("checkboxData");

	console.log('Check Box->'+JSON.stringify(checkboxArr));
}
var alertFn = function(classAlert, head, txtSt) {
	var html = "";
	html += '<div class="' + classAlert + '" id="alertClose" style="margin-bottom: 5px">';
	html += '<button style="width:2%" type="button" class="close" data-dismiss="alert">&times;</button>';
	html += '<strong >' + head + '</strong> ' + txtSt + '';
	html += '</div>';
	$("#strAlert").html(html);
}

var getEndingbalance = function(){
	var html="";
	$.ajax({
		url:"http://"+host+"/api/public/output/total",
		type:"get",
		crossDomain: true,
		dataType:"json",
		data:{
			"entity" 	:$("#inputEntity").val(),
			"year"		:$("#inputYear").val(),
			"month"	    :$("#inputMonth").val()
		},
		success:function(data){ 
			$.each(data,function(index,indexEntry){
				if(indexEntry['total_amount'] != null)
					$("#total").text("Total Ending Balance : "+formatCurrency(indexEntry['total_amount']));
				else
					$("#total").text("");	
				if (indexEntry['total_amount'] != 0.00 &&indexEntry['total_amount'] != null)  
					$("#total").addClass('TextRed');
				else  
					$("#total").removeClass("TextRed");
			});
		}
	})
}

function formatCurrency(val){     
	if(val == "" || val == null || val == "NULL") return val;
	//Split Decimals
	var negative = 	val.search("-")+1;
	val = val.substr(val.search("-")+1,val.length);

	var arrs = val.toString().split("."); 	
	//Split data and reverse
	var revs = arrs[0].split("").reverse().join("");    	
	var len = revs.length;
	var tmp = "";  
	for(i = 0; i < len; i++){		
		if(i >0 && (i%3) == 0) 
			tmp+=","+revs.charAt(i);         
		else
			tmp += revs.charAt(i);
	}  
	//Split data and reverse back
	tmp = tmp.split("").reverse().join("");	
	//Check Decimals
	if(arrs.length > 1 && arrs[1] != undefined){  
		tmp += "."+ arrs[1];  
	}  
	if(negative) tmp = '-'+tmp;
	return tmp;  
} 

var autocompleteAccount = [];
var autocompleteCounterpart = [];
var autocompleteCustom1 = [];
function getAutocomplete(type){
	$.ajax({
		url:"http://"+host+"/api/public/output/auto",
		type:"get",
		crossDomain: true,
		dataType:"json",
		data:{"type" : type},
		success:function(data){ 
			if(type == 'account' && data != undefined){
				autocompleteAccount = data;
			}
			else if(type == 'counterpart' && data != undefined){
				autocompleteCounterpart = data;
			}
			else if(type == 'custom1' && data != undefined){
				autocompleteCustom1 = data;
			}
		}
	})
	$(".tagsAccount").autocomplete({    // tagsAccount function
		minLength: 1,
		source: function (request, response) {
			var results = $.ui.autocomplete.filter(autocompleteAccount, request.term);
			response(results.slice(0, 10));
		}
	});
	$(".tagsCounterpart").autocomplete({  //tagsCounterpart function
		minLength: 1,
		source: function (request, response) {
			var results = $.ui.autocomplete.filter(autocompleteCounterpart, request.term);
			response(results.slice(0, 10));
		}
	});
	$(".tagsCustom1").autocomplete({   //tagsCustom1 function
		minLength: 1,
		source: function (request, response) {
			var results = $.ui.autocomplete.filter(autocompleteCustom1, request.term);
			response(results.slice(0, 10));
		}
	});
}