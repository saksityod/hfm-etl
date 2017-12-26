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

<div id="pageimport" style="display: none;">
	<div class="panel panel-primary" style="padding-bottom: 10px;">
		<div class="panel-heading">Import Trial Balance</div>
		<div class="panel-body">
			<div class="row-fluid">
				<h6>Browse text files from your computer (.txt)</h6>
				<form id="fileImport"> 
					<div class="fileUpload ">
						<input type="file" name="file" id="file" accept="text/plain" style="color: #a6a6a6"> 
						<button  name="importFile" id="importFile" value="Import" type="submit" data-loading-text="Loading..." class="btn btn-success" ><i class="icon-play icon-white"></i> RUN ETL</button>
						<!-- <h6 class="label-content-import-export"></h6> -->
					</div>
				</form> 
			</div>

		</div> <!-- panel-body1 -->
	</div> <!-- panel panel-1-->

	<!-- <button type="button" class="btn btn-primary" data-loading-text="Loading...">Loading state</button> -->

	<div id="myAlert" ></div>

	<div class="panel panel-danger" id="Missing" style="display: none; color: #444444;"> 
		<div class="panel-heading" style="padding-top: 5px; padding-bottom: 5px;"><b>Missing! </b>there is not data to mapping. 
			<button type="button" onclick="CloseAlert()" class="close" >&times;</button>
		</div>
		<div class="panel-body">
			<table class="table table-striped" style="margin-bottom: 0px;">
				<thead>
					<tr>
						<th>&emsp;#</th>
						<th>Mapping Type</th>
						<th>Value</th>
					</tr>
				</thead>
				<tbody id="TabelERROR">
				</tbody>
			</table>
		</div> <!-- panel-bodyin -->
	</div> <!-- panel panel-in-->
</div>