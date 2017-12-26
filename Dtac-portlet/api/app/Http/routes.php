<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
	return view('welcome');
});
// if (isset($_SERVER['HTTP_ORIGIN'])) {
//  header('Access-Control-Allow-Credentials: true');
//  header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_ORIGIN']);
//  header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
//  header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, useXDomain, withCredentials');
//  //header('Keep-Alive: timeout=10, max=100');
// }

Route::group(['middleware' => 'cors'], function(){

	Route::get('input', 'PageInputController@index');
	Route::post('input/add', 'PageInputController@add');
	Route::delete('input/del', 'PageInputController@del');
	Route::patch('input/edit', 'PageInputController@edit');
	// Route::get('input/test', 'PageInputController@test');
	// Route::get('testedit', 'PageInputController@edit');

	Route::get('select', 'PageSelectController@index');
	Route::get('select/complete', 'PageSelectController@complete');

	Route::get('entity', 'PageSelectOutputController@entity');
	Route::get('year', 'PageSelectOutputController@year');
	Route::get('month', 'PageSelectOutputController@month');

	Route::get('output', 'PageOutputController@index');
	Route::get('output/total', 'PageOutputController@total');
	Route::post('output/add', 'PageOutputController@add');
	Route::patch('output/edit', 'PageOutputController@edit');
	Route::delete('output/del', 'PageOutputController@del');
	Route::get('output/auto', 'PageOutputController@auto_complete');
	// Route::get('output/test', 'PageOutputController@testedit');

	Route::post('import', 'PageImportController@import');
	// Route::post('import', 'PageImportController@index');
	// Route::post('import/http', 'PageImportController@http');
	// Route::post('import', 'PageImportController@index');

	Route::post('export', 'PageExportController@index');
	Route::get('export/entity', 'PageExportController@entity');
	Route::get('export/year', 'PageExportController@year');
	Route::get('export/month', 'PageExportController@month');

	Route::post('login', 'PageUsageController@index');
	Route::get('login/open', 'PageUsageController@openUsage');
	// Route::get('login/test', 'PageUsageController@test');

	// Route::get('http', 'HTTPRequestsController@index');
	// Route::get('http/test', 'HTTPRequestsController@input');
	// Route::get('http/map', 'HTTPRequestsController@mapping');

});
// Route::get('input/update/{id}', function($id){
//     $article = App\MappingDataHeader::findOrFail($id);

//     return $article;
// });


