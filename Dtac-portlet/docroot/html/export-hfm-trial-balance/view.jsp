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

<div id="pageExport" style="display: none;">
	<div class="panel panel-primary">
		<div class="panel-heading">Export HFM Trial Balance</div>
		<div class="panel-body">
			<div class="row-fluid">
				<div class="span12">
					<div class="span9">
						<div class="btn-group span4" data-toggle="tooltip" title="Entity" >
							<a class="btn dropdown-toggle" data-toggle="dropdown" href="#" 
								style="width: 90%; height: 100%;"> <span id='entity'
								style="float: left;">Select Entity &nbsp;(0)</span> <span
								style="float: right;" class="caret"></span>
							</a>
							<ul class="dropdown-menu"
								style="overflow: auto; width: 98%; height: 200px; overflow-x: hidden;"
								id="selectEntity">
							</ul>
						</div>
						<!-- </div> -->
						<!-- <div class="span3"> -->
						<select class="span4" id="selectYear" style="margin-bottom: 0px;" data-toggle="tooltip" title="Year" >
							<!-- Year -->
						</select>
						<!-- </div> -->
						<!-- <div class="span3"> -->
						<select class="span4" id="selectMonth" style="margin-bottom: 0px;" data-toggle="tooltip" title="Month" >
						</select>
					</div>

					<div class="span2 offset1">
						<form id="exportSub" action="#" method="post">
							<button id="btnExport" type="button" class="btn btn-info span7"
								style="float: right;">
								<i class="icon-download-alt icon-white"></i> Export
							</button>
						</form>
					</div>

				</div>
			</div>
		</div>
		<!-- panel-body1 -->
	</div>
	<!-- panel panel-1-->
	<div id="strAlert"></div>
</div>