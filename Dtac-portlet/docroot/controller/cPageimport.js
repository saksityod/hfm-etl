
$(document).ready(function(){
	getLogin();
	buttonOpenClose();
	$('input[type=file]').on('change', prepareUpload);
	$('form#fileImport').on('submit', uploadFiles);
	$('[data-toggle="tooltip"]').tooltip();  // tooltip
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
				$("#pageimport").show();
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

var files;

function buttonOpenClose(event){
	$("#importFile").prop("disabled", true);
}

function prepareUpload(event){
	files = event.target.files;
	$("#importFile").prop("disabled", false);
	$("#Missing").hide();	
	$("#alertID").alert('close'); 
}
function CloseAlert(){
	$("#Missing").hide();	
}

function uploadFiles(event){
	$("#importFile").prop("disabled", true);
	event.stopPropagation(); 
	event.preventDefault(); 

	var data = new FormData();
	$.each(files, function(key, value)
		{data.append(key, value);
		});
	 data.append('user', $("#user_portlet").val());
	$("body").mLoading('show'); //Loading
	$.ajax({
		url: "http://"+host+"/api/public/import",
		type: 'post',
		data: data,
		crossDomain: true,
		dataType: 'json',
		processData: false, 
		contentType: false, 
		// headers:{Authorization:"Bearer "+tokenID.token},
		success: function(data, textStatus, jqXHR){
			if(data['status'] == 200){
				$("#file").val("");
				alertFn("alert alert-success","Success! ","Run ETL has successfully.");
				$("body").mLoading('hide'); //Loading
			}
			else if(data['status'] == 400){
				alertFn("alert ","Sorry! ","Change a few things up and try import again.");
				$("body").mLoading('hide'); //Loading
			}
			else{
				$("#file").val("");
				genTabelERROR(data);
				$("body").mLoading('hide'); //Loading
			}
		},
		error: function(jqXHR, textStatus, errorThrown){
			alertFn("alert alert-error","Sorry! ","Can not connect to server. (500)");
			$("#file").val("");
			$("body").mLoading('hide'); //Loading
		}
	});
}	
var alertFn = function(classAlert,head,txtSt){
	var html="";
	html+= '<div class="'+classAlert+'" id="alertID">';
	html+= '<button type="button" class="close" data-dismiss="alert">&times;</button>';
	html+= '<strong >'+head+'</strong> '+txtSt+'';
	html+= '</div>';
	$("#myAlert").html(html);
}

var genTabelERROR = function(data){
	var html='';
	$.each(data,function(index, indexEntry) {
		html += '<tr><td>&emsp;'+(index+1)+'</td>';
		html += '<td>'+ indexEntry['type_name']+'</td>';
		html += '<td>'+ indexEntry['type_code']+'</td>';
		html += '</tr>';
	});
	$("#TabelERROR").html(html);
	$("#Missing").show();	
}