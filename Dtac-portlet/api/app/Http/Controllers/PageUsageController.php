<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
// use DateTimeZone;
use DateTime;
use App\Http\Requests;
use App\Contracts\Publisher;
use App\UsageLog;

class PageUsageController extends Controller
{
	public function index(Request $request){
		$user_portlet = $request->user_portlet;
		$url_portlet = $request->url_portlet;
		$plid_portlet = $request->plid_portlet;

		$now = new DateTime();
		// $thai = $now->setTimezone('Asia/Bangkok');
		// $thai = new DateTimeZone('Asia/Bangkok');
		$data[] = [
			"user_code" => $url_portlet,
			"user_name" => $user_portlet,
			"portlet_id" => $plid_portlet,
			// "usage_dttm" => {'m-d-Y'}
			"usage_dttm" => $now
		];
		$insert = DB::table("usage_log")->insert($data);
		return response()->json(["status" => 200]);
	}

	public function openUsage(Request $request){
		$start_date = $request->start_date;
		$start_date = $start_date.' 00:00:00.000';
		
		$end_date = $request->end_date;
		$end_date = $end_date.' 23:59:59.000';

		$Results = DB::table('usage_log')
		->select('user_name','portlet_id','usage_dttm')
		->where('usage_dttm','>',$start_date)
		->where('usage_dttm','<',$end_date)
		->orderBy('usage_dttm','desc')->get();

		///
		$connec = DB::connection('sqlsrv2');
		$Result = $connec->table('Layout')->select('plid','friendlyURL')->get();

		foreach ($Results as $key => $value) {
			foreach ($Result as $key => $value1) {
				if ($value->portlet_id == $value1->plid) {
					$value->portlet_id = $value1->friendlyURL;
				}
			}
		}
		///

		return response()->json($Results);
	}

	// public function test(){

	// 	// $ResultsUsage = DB::table('usage_log')
	// 	// ->select('portlet_id')->distinct()->get();

	// 	$ResultsUsage = DB::table('usage_log')
	// 	->select('user_name','portlet_id','usage_dttm')
	// 	->where('usage_dttm','>',$start_date)
	// 	->where('usage_dttm','<',$end_date)
	// 	->orderBy('usage_dttm')->get();

	// 	$connec = DB::connection('sqlsrv2');
	// 	$Result = $connec->table('Layout')->select('plid','friendlyURL')->get();

	// 	foreach ($ResultsUsage as $key => $value) {
	// 		foreach ($Result as $key => $value1) {
	// 			if ($value->portlet_id == $value1->plid) {
	// 				$value->portlet_id = $value1->friendlyURL;
	// 			}
	// 		}
	// 	}

	// 	// $connec = DB::connection('sqlsrv2');
	// 	// $result = $connec->table('Layout')->select('plid','friendlyURL')->get();

	// 	// $Results = $connec->select('
	// 	// 	select plid, friendlyURL
	// 	// 	from Layout 
	// 	// 	');

	// 	return response()->json($ResultsUsage);
	// }

}
