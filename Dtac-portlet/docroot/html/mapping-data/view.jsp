<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet"%>

<%@ taglib uri="http://alloy.liferay.com/tld/aui" prefix="aui"%>
<%@ page import="javax.portlet.*"%>
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="com.liferay.portal.kernel.util.WebKeys" %>
<%@ taglib uri="http://liferay.com/tld/theme" prefix="liferay-theme" %>
<liferay-theme:defineObjects />
<portlet:defineObjects />
<%
	String username = themeDisplay.getUser().getScreenName();
	String password = (String)request.getSession().getAttribute(WebKeys.USER_PASSWORD);
	layout = themeDisplay.getLayout();
	plid = layout.getPlid();
%>

<input type="hidden" id="user_portlet" name="user_portlet" value="<%=username%>">
<input type="hidden" id="pass_portlet" name="pass_portlet" value="<%=password%>">
<input type="hidden" id="url_portlet" name="url_portlet" value="<%= renderRequest.getContextPath() %>">
<input type="hidden" id="plid_portlet" name="plid_portlet" value="<%= plid %>">


<div id="pageInput" class="row-fluid" style="display: none;">
	<!-- Panel mapping data start-->
	<div class="panel panel-primary " id="panelMain"  style="padding-bottom: 15px;">
		<div class="panel-heading">Mapping data</div>
		<div class="panel-body">
			<!-- panel-body start-->
			<div class="row-fluid">
				<div class="span7">
					<select class="span6" id="listShow" onchange="selectDataSearchFn()"
					data-toggle="tooltip" title="Entity type">
					<!-- Show Data Type(select) -->
				</select> <input class="span6" type="text" placeholder="Search..." name="tags" id="tags"
				data-toggle="tooltip" title="Search" onchange="selectDataSearchFn()">
			</div>
			<div class="span3 offset2">
				<button id="btnSearch" type="button" class="btn btn-info span5"
				style="float: right;">
				<i class="icon-search icon-white"></i> Search
			</button>
			<!-- Input Data Type (hidden) -->
			<input id="inputDataType" type="hidden">
			<!-- Input Key Search (hidden) -->
			<input id="inputKeySearch" type="hidden">
		</div>
	</div>
</div>
<!-- panel-body End-->
</div>
<!-- Panel mapping data End -->

<!-- Panel data type and list data start-->
<div class="panel panel-primary" id="DataTypePanel" style="Display: none;">
	<div class="panel-heading" id="DataTypeName"></div>
	<div class="panel-body">
		<!-- Start well -->
		<div class="well" style="padding-bottom: 10px;">
			<div class="row-fluid">
				<div class="span3">
					<button type="button" class="btn btn-success span4" id="btnAdd">Add</button>
					<button type="button" class="btn btn-warning span4" id="btnEdit">Edit</button>
					<button type="button" class="btn btn-danger span4" id="btnDel">Delete
					</button>
				</div>
				<div class="span2 offset7" style="float: right;">
					<button type="button" class="btn btn-primary span6" id="btnSave">Save</button>
					<button type="button" class="btn btn-danger span6" id="btnCencel">Cancel</button>
				</div>
			</div>
		</div>
		<!-- End well -->
		
		<div id="strAlert"></div>
			<table class="table table-striped" style="margin-bottom: 0px;">
				<thead >
					<tr id="headTable">
					</tr>
				</thead>
				<tbody id="bodyTable"></tbody>
			</table>
	</div> <!-- panel-body -->
</div> <!-- Panel data type and list data end-->
</div>