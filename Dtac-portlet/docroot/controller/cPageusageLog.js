$(document).ready(function(){
//------------tooltip----------------
$('[data-toggle="tooltip"]').tooltip()

getLogin();

$( function() {
	$( "#datepickerStart" ).datepicker({ dateFormat: 'yy-mm-dd' });
	$( "#datepickerEnd" ).datepicker({ dateFormat: 'yy-mm-dd' });
});

$("#btnSearch").click(function() {
	$("#alertClose").alert('close'); // close Alert.
	if( $("#datepickerStart").val()&&$("#datepickerEnd").val())
		getDataFn();
});

});

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
				$("#PageusageLog").show();
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

function eventInput(){   // Event input
	if($("#datepickerEnd").val() && $("#datepickerStart").val()){
		$("#btnSearch").prop("disabled", false);
		$('button[id="btnSearch"]').focus();
	}
}

function getDataFn(){ // Get Data
	var dateStart = $("#datepickerStart").val();
	var dateEnd = $("#datepickerEnd").val();

$("body").mLoading('show');  	 //Loading
$.ajax({
	url : "http://" + host + "/api/public/login/open",
	type : "get",
	crossDomain : true,
	dataType : "json",
	data : {
		"start_date" : dateStart,
		"end_date"   : dateEnd
	},
	success : function(data) {
		if(data){
		$("body").mLoading('hide'); 		// Loading
		genTableShowFn(data);
	}
	else {
			$("body").mLoading('hide'); 	//Loading
			alertFn("alert","Sorry! ","Change a few things up and try get data again.");
		}
	},
	error: function(jqXHR, textStatus, errorThrown){
		alertFn("alert alert-error","Sorry! ","Can not connect to server. (500)");
		$("body").mLoading('hide'); 		//Loading
	}
})
}

function genTableShowFn(dataArr){
	var htmlBody = "";
	$.each(dataArr,function(index, indexEntry) {
		htmlBody += '<tr>';
		htmlBody += '<td>'+indexEntry['usage_dttm']+'</td>';
		htmlBody += '<td>'+indexEntry['user_name']+'</td>';
		htmlBody += '<td>'+indexEntry['portlet_id']+'</td>';

		htmlBody += "</tr>";
	});
	$("#showTbody").html(htmlBody);
	$("#panelusege").show();
}

var alertFn = function(classAlert, head, txtSt) {
	var html = "";
	html += '<div class="' + classAlert + '" style="margin-bottom: 0px;" id="alertClose">';
	html += '<button type="button" class="close" data-dismiss="alert">&times;</button>';
	html += '<strong >' + head + '</strong> ' + txtSt + '';
	html += '</div>';
	$("#strAlert").html(html);
}