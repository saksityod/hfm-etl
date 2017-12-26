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

		<div id="pageOutput" style="display: none;">
		<div class="panel panel-primary">
			<div class="panel-heading">Adjust HFM Trial Balance</div>
			<div class="panel-body">
				<div class="row-fluid ">
					<div class="span12">
						<div class="span9">
							<select  onchange="eventInput()" id="selectEntity" class="span4" data-toggle="tooltip" title="Entity"><!-- Entity --></select>
							<select onchange="eventInput()" class="span4" id="selectYear" data-toggle="tooltip" title="Year"><!-- Year --></select>
							<select onchange="eventInput()" class="span4" id="selectMonth"  data-toggle="tooltip" title="Month">
							</select>
						</div>
						<div class="span3" style="float: right;">
							<button id="btnSearch" type="button" class="btn btn-info span5 offset7" style="float: right; "><i class="icon-search icon-white"></i> Search</button>
						</div>
					</div>
				</div>
			</div> <!-- panel-body1 -->
		</div> <!-- panel panel-1-->

		<input type="hidden" name="Entity" id="inputEntity">  <!-- hidden input entity. -->
		<input type="hidden" name="Year"   id="inputYear">    <!-- hidden input year. -->
		<input type="hidden" name="Month"  id="inputMonth">   <!-- hidden input month. -->

		<div class="panel panel-primary" id="panel" style="display: none;">
			<div class="panel-heading">HFM Output Data</div>
			<div class="panel-body">
				<div class="accordion" id="accordion2">   <!-- accordion -->
					<div class="accordion-group" style="border-width: 1px;">
						<div class="accordion-heading">
							<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapseOne">
								Show Detail
							</a>
						</div>
						<div id="collapseOne" class="accordion-body collapse">
							<div class="accordion-inner">   <!-- Data --> 
								<div class="row-fluid">
									<div class="span12">
										<div class="span2"> <b>!YEAR</b></div>
										<div class="span10" id="showYear">none</div>
									</div>
								</div>
								<div class="row-fluid">
									<div class="span12">
										<div class="span2"> <b>!PERIOD</b></div>
										<div class="span10" id="showMonth">none</div>
									</div>
								</div>
								<div class="row-fluid">
									<div class="span12">
										<div class="span2"> <b>!VALUE</b></div>
										<div class="span10">THB</div>
									</div>
								</div>
								<div class="row-fluid">
									<div class="span12">
										<div class="span2"> <b>!SCENARIO</b></div>
										<div class="span10">Actual</div>
									</div>
								</div> 
								<div class="row-fluid">
									<div class="span12">
										<div class="span2"> <b>!VIEW</b></div>
										<div class="span10">YTD</div>
									</div>
								</div>
								<div class="row-fluid">
									<div class="span12">
										<div class="span2"> <b>!CUSTOM2</b></div>
										<div class="span10">[None]</div>
									</div>
								</div>
								<div class="row-fluid">
									<div class="span12">
										<div class="span2"> <b>!CUSTOM3</b></div>
										<div class="span10">[None]</div>
									</div>
								</div>
								<div class="row-fluid">
									<div class="span12">
										<div class="span2"> <b>!CUSTOM4</b></div>
										<div class="span10">IMPFILE</div>
									</div>
								</div>
								<div class="row-fluid">
									<div class="span12">
										<div class="span2"> <b>!column_order</b></div>
										<div class="span5">Entity, Account, ICP, Custom1</div>
										<div class="span5" style="text-align: right; color: #3333ff;"><p id="total"></p></div>
									</div>
								</div>
							</div>  <!-- Data --> 
						</div>
					</div>
				</div> 	<!-- accordion -->

				<div class="well">
					<div class="row-fluid">
						<div class="span12">
							<div class="span3">
								<button type="button" class="btn btn-success span4" id="btnAdd">Add</button>
								<button type="button" class="btn btn-warning span4" id="btnEdit">Edit</button>
								<button type="button" class="btn btn-danger span4" id="btnDel">Delete</button>
							</div>
							<div class="span2 offset6" style="float: right;">
								<button id="btnSave" type="button" class="btn btn-primary span6">Save</button>
								<button id="btnCencel" type="button" class="btn btn-danger span6">Cancel</button> 
							</div>
						</div>
					</div>
				</div>

				<div id="strAlert"></div> <!-- Show Alert -->

					<table class="table table-striped" style="margin-bottom: 0px;">
						<thead>
							<tr> 
								<th> <label>&emsp;<input type="checkbox" id="allCheck" class="checkboxGet"></label> </th>
								<th >Entity</th>
								<th >Account Code</th>
								<th >Counterpart</th>
								<th >Custom1</th>
								<th >Ending Balance</th>
								<th >Created By</th>
								<th >Created Dttm</th>
								<th >Updated By</th>
								<th >Updated Dttm</th>
							</tr>
						</thead>
						<tbody id="ShowTbody">
						</tbody>
					</table>
			</div> <!-- panel-body2 -->
		</div> <!-- panel panel-2-->
	</div>