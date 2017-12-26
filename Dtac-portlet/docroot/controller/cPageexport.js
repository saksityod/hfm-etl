
$(document).ready(function(){
	getLogin();
	$("#btnExport").click(function() {
		$("#alertClose").alert('close'); // close Alert.
		if($("#selectYear").val() && $("#selectMonth").val() && options.length)
			exportFn();
		else
			alertFn("alert", "Warning! ","Please select an entity to export.");
	});

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
				getYear();
				getEntity();
				getMonth();
				$("#pageExport").show();
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

var getYear = function(){
	var html="";
	$.ajax({
		url:"http://"+host+"/api/public/export/year",
		type:"get",
		crossDomain: true,
		dataType:"json",
		success:function(data){ 
			$.each(data,function(index,indexEntry){
				html+='<option value="'+indexEntry['fiscal_year']+'">'+indexEntry['fiscal_year']+'</option>';			
			});
			$("#selectYear").html(html);
			$("body").mLoading('hide');
		},
		error: function(jqXHR, textStatus, errorThrown){
			alertFn("alert alert-error","Sorry! ","Can not connect to server. (500)");
				$("body").mLoading('hide'); //Loading
			}
		})
}
var getMonth = function(){
	var html="";
	$.ajax({
		url:"http://"+host+"/api/public/export/month",
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

var options = [];
var getEntity = function(){
	var html="";
	$.ajax({
		url:"http://"+host+"/api/public/export/entity",
		type:"get",
		crossDomain: true,
		dataType:"json",
		success:function(data){ 
			$.each(data,function(index,indexEntry){
				html+='<li><a href="#" class="small" data-value="'+indexEntry['entity_code']+'" tabIndex="-1"><input style="margin-top: -2px;" type="checkbox"/>&emsp;'+indexEntry['entity_code']+'</a></li>';			
			});
			$("#selectEntity").html(html);
			$("body").mLoading('hide');

			
			$( '.dropdown-menu a' ).on( 'click', function( event ) {
				var $target = $( event.currentTarget ),
				val = $target.attr( 'data-value' ),
				$inp = $target.find( 'input' ),
				idx;
				if ( ( idx = options.indexOf( val ) ) > -1 ) {
					options.splice( idx, 1 );
					setTimeout( function() { $inp.prop( 'checked', false ) }, 0);
				} else {
					options.push( val );
					setTimeout( function() { $inp.prop( 'checked', true ) }, 0);
				}
				$( event.target ).blur();
				$("#entity").text("Select Entity ("+options.length+")");	
				console.log( options );
				return false;
			});
		},
		error: function(jqXHR, textStatus, errorThrown){
			alertFn("alert alert-error","Sorry! ","Can not connect to server. (500)");
				$("body").mLoading('hide'); //Loading
			}
		})
}

var exportFn = function(){
	var html="";
	var addArr=[];
	$("body").mLoading('show');
	addArr.push({
		"year"  : $("#selectYear").val(),
		"month" : $("#selectMonth").val(),
		"entity" : options,
	});

	console.log(JSON.stringify(addArr));
	var param="";
	param+="datas="+JSON.stringify(addArr);
	$("form#exportSub").attr("action","http://" + host + "/api/public/export?"+param);
	$("form#exportSub").submit();
	$("body").mLoading('hide');
}

var alertFn = function(classAlert, head, txtSt) {
	var html = "";
	html += '<div class="' + classAlert + '" style="margin-bottom: 0px;" id="alertClose">';
	html += '<button type="button" class="close" data-dismiss="alert">&times;</button>';
	html += '<strong >' + head + '</strong> ' + txtSt + '';
	html += '</div>';
	$("#strAlert").html(html);
}