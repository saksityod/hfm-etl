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
	
	<div id="PageusageLog" style="display: none;" >
		<div class="panel panel-primary" >
			<div class="panel-heading">Advance Search</div>
			<div class="panel-body">
				<div class="row-fluid">
					<div class="span12">
						<div class="span8">
							<input class="span5" type="text" placeholder="Usage Start Date" id="datepickerStart" data-toggle="tooltip" title="Usage Start Date" onchange="eventInput()">

							<input class="span5" type="text" placeholder="Usage End Date" id="datepickerEnd" data-toggle="tooltip" title="Usage End Date" onchange="eventInput()">
						</div>
						<div class="span4">
							<button id="btnSearch" disabled="ture" type="button" class="btn btn-info span4" style="float: right;"><i class="icon-search icon-white"></i> Search</button>
						</div>
					</div>
				</div>
			</div> <!-- panel-body1 -->
		</div> <!-- panel panel-1-->
		<div id="strAlert"></div>
		<div class="panel panel-primary"  id="panelusege" style="display: none;">
			<div class="panel-heading">Usage log</div>
			<div class="panel-body">
				<table class="table table-striped" style="margin-bottom: 0px;">
					<thead>
						<tr>

							<th>Usage Date</th>
							<th>User Name</th>
							<th>Menu</th>
						</tr>
					</thead>
					<tbody id="showTbody"></tbody>
				</table>
			</div> <!-- panel-body2 -->
		</div> <!-- panel panel-2-->
	</div>