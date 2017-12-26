<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use DateTime;
use App\Http\Requests;
use App\TargetTrialBalance;
use Illuminate\Database\Eloquent\ModelNotFoundException;


class PageOutputController extends Controller
{
	public function index(Request $request){
		$entity = $request->entity;
		$year = $request->year;
		$month = $request->month;

		$result = DB::table('target_trial_balance')
		->select('target_tb_id','entity_code','account_code','counterpart','custom','net_amount','created_by','created_dttm','updated_by','updated_dttm')
		->where('entity_code',$entity)
		->where('fiscal_year',$year)
		->where('month_name',$month)
		->orderBy('entity_code', 'asc')
		->orderBy('account_code', 'asc')
		->orderBy('custom', 'asc')->get();

		foreach ($result as $key => $value) {
			if ($value->net_amount == '.00') {
				$value->net_amount = '0.00';
			}
		}
		return response()->json($result);
	}

	public function total(Request $request){

		$result = DB::table('target_trial_balance')
		->select(DB::raw('SUM(net_amount) as total_amount'))
		->where('entity_code',$request->entity)
		->where('fiscal_year',$request->year)
		->where('month_name',$request->month)->get();

		foreach ($result as $key => $value) {
			if ($value->total_amount == '.00') {
				$value->total_amount = '0.00';
			}
		}
		return response()->json($result);
	}

	public function test2(Request $request){
		$datas = json_decode($request->datas);

		foreach ($datas as $data) {
			$result = DB::table('target_trial_balance')
			->select('fiscal_year', 'month_name','entity_code','account_code','counterpart','custom')
			->where('fiscal_year', $data->year)
			->where('month_name', $data->month)
			->where('entity_code', $data->entity)
			->where('account_code', $data->account)
			->where('counterpart', $data->counterpart)
			->where('custom', $data->custom)->distinct()->get();

			if ($result == null) {
				return "mai sam";
			}else{
				return "sam";
			}
		}
		// return response()->json($result);
	}

	public function add(Request $request){
		$datas = json_decode($request->datas);
		$information = 1;

		foreach ($datas as $data){
			$result1 = DB::table('mapping_data_header')
			->select('target_code1')
			->where('entity_type_id','=',3)
			->where('target_code1', $data->account)->distinct()->get();

			if ($result1 != null) {
				if ($data->counterpart == '[ICP None]') {
					$result2 = '[ICP None]';		
				}else{
					$result2 = DB::table('mapping_data_header')
					->select('target_code1')
					->where('entity_type_id','=',2)
					->where('target_code1', $data->counterpart)->distinct()->get();
				}

				if ($result2 != null) {
					$result3 = DB::table('mapping_data_header')
					->select('target_code2')
					->where('entity_type_id','=',3)
					->where('target_code2', $data->custom)->distinct()->get();

					if ($result3 == null) {
						$information = 0;  //don't have data in mapping_data_header
						return response()->json(["status" => 401, "data" => $data->custom, "type" => "Custom1"]);
					}
				}else{
					$information = 0;  //don't have data in mapping_data_header
					return response()->json(["status" => 401, "data" =>$data->counterpart, "type" =>"Counterpart"]);
				}
			}else{
				$information = 0; //don't have data in mapping_data_header
				return response()->json(["status" => 401, "data" => $data->account, "type" => "Account code"]);
			}		
		}//check have data in table mapping_data_header

		if ($information != 0) {
			foreach ($datas as $data) {
				$result = DB::table('target_trial_balance')
				->select('fiscal_year', 'month_name','entity_code','account_code','counterpart','custom')
				->where('fiscal_year', $data->year)
				->where('month_name', $data->month)
				->where('entity_code', $data->entity)
				->where('account_code', $data->account)
				->where('counterpart', $data->counterpart)
				->where('custom', $data->custom)->distinct()->get();
				//check data sum 
				$now = new DateTime();
				if ($result == null) {
					$dataSet = [];
					foreach ($datas as $data) {
						$dataSet[] = [
							"fiscal_year" => $data->year,
							"month_name" => $data->month,
							"entity_code" => $data->entity,
							"account_code" => $data->account,
							"counterpart" => $data->counterpart,
							"custom" => $data->custom,
							"net_amount" => $data->net_amount,
							"created_by" => $data->create_by,
							"created_dttm" => $now,
							"updated_by" => $data->update_by,
							"updated_dttm" => $now
						];
					}
					$resultInsert = DB::table("target_trial_balance")->insert($dataSet);
					return response()->json(["status" => 200]);
				}else{
					//sam
					return response()->json(["status" => 400, "data" => $data->account, "type" => "account"]);
				}
			}
		}	
	}

	public function edit(Request $request){

		$datas = json_decode($request->datas);
		$information = 1;  //have data in mapping_data_header

		foreach ($datas as $data){
			$result1 = DB::table('mapping_data_header')
			->select('target_code1')
			->where('entity_type_id','=',3)
			->where('target_code1', $data->account)->get();

			if ($result1 != null) {
				if ($data->counterpart == '[ICP None]') {
					$result2 = '[ICP None]';		
				}else{
					$result2 = DB::table('mapping_data_header')
					->select('target_code1')
					->where('entity_type_id','=',2)
					->where('target_code1', $data->counterpart)->get();
				}
				
				if ($result2 != null) {
					$result3 = DB::table('mapping_data_header')
					->select('target_code2')
					->where('entity_type_id','=',3)
					->where('target_code2', $data->custom)->get();

					if ($result3 == null) {
						$information = 0;  //don't have data in mapping_data_header
						return response()->json(["status" => 401, "data" => $data->custom, "type" => "Custom1"]);
					}
				}else{
					$information = 0;  //don't have data in mapping_data_header
					return response()->json(["status" => 401, "data" => $data->counterpart, "type" => "Counterpart"]);
				}
			}else{
				$information = 0; //don't have data in mapping_data_header
				return response()->json(["status" => 401, "data" => $data->account, "type" => "Account code"]);
			}		
		}

		if ($information != 0) {
			foreach ($datas as $data) {
				$result = DB::table('target_trial_balance')
				->select('fiscal_year','month_name','entity_code')
				->where('target_tb_id', $data->id)->get();

				foreach ($result as $re) {
					$resultSQL = DB::table('target_trial_balance')
					->select('fiscal_year','month_name','entity_code','account_code','counterpart','custom')
					->where('fiscal_year', $re->fiscal_year)
					->where('month_name', $re->month_name)
					->where('entity_code', $re->entity_code)
					->where('account_code', $data->account)
					->where('counterpart', $data->counterpart)
					->where('custom', $data->custom)
					->where('target_tb_id','!=', $data->id)->get();

				// return response()->json($resultSQL);	
					if ($resultSQL == null) {
						$now = new DateTime();

						$sqlStr = "
						UPDATE target_trial_balance
						SET account_code = ?, counterpart = ?, custom = ?, net_amount = ?, updated_by = ?, updated_dttm = ?
						WHERE target_tb_id = ?";

						$dataSet = [];
						foreach ($datas as $data) {
							$result = DB::update($sqlStr, array($data->account, $data->counterpart, $data->custom, $data->net_amount, $data->update_by, $now, $data->id));
						}
					}else{
						//sam
						return response()->json(["status" => 400, "data" => $data->account, "type" => "account"]);
					}			
				}//end for in
			}//end big for
			return response()->json(["status" => 200]);
		}
	}


	public function del(Request $request){

		$datas = json_decode($request->datas);
		foreach ($datas as $data) {
			$i = TargetTrialBalance::findOrFail($data->id);
			$i->delete();			
		}	
		return response()->json(['status' => 200]);
	}


	public function auto_complete(Request $request){
		$type = $request->type;

		if ($type == 'account') {

			$type = 3;
			$sqlStr = "
			SELECT DISTINCT target_code1 FROM mapping_data_header WHERE entity_type_id = ?";
			$result = DB::select($sqlStr, array($type));
			$variable = 'target_code1';

		}if ($type == 'counterpart') {

			$type = 2;
			$sqlStr = "
			SELECT DISTINCT target_code1 FROM mapping_data_header WHERE entity_type_id = ?";
			$result = DB::select($sqlStr, array($type));
			$variable = 'target_code1';

		}if ($type == 'custom1') {

			$sqlStr = "
			SELECT DISTINCT target_code2 FROM mapping_data_header WHERE target_code2 != 'null'";
			$result = DB::select($sqlStr);
			$variable = 'target_code2';
		}

		$result = collect($result)->toArray();

		$resultArr = array();
		foreach ($result as $key => $value) {
			array_push($resultArr, $value->$variable);
		}
		return response()->json($resultArr);
	}

	public function test(Request $request){

		$datas = json_decode($request->datas);
		$information = 1;  //have data in mapping_data_header

		foreach ($datas as $data){
			$result1 = DB::table('mapping_data_header')
			->select('mapping_data_id')
			->where('target_code1', $data->account)->get();

			if ($result1 != null) {
				$result2 = DB::table('mapping_data_header')
				->select('mapping_data_id')
				->where('target_code1', $data->counterpart)->get();

				if ($result2 != null) {
					$result3 = DB::table('mapping_data_header')
					->select('mapping_data_id')
					->where('target_code2', $data->custom)->get();

					if ($result3 == null) {
						$information = 0;  //don't have data in mapping_data_header
					}
				}else{
					$information = 0;  //don't have data in mapping_data_header
				}
			}else{
				$information = 0; //don't have data in mapping_data_header
			}		
		}
		return $information;
		// return response()->json($result1);

		// foreach ($datas as $data) {
		// 	$result = DB::table('target_trial_balance')
		// 	->select('fiscal_year','month_name','entity_code')
		// 	->where('target_tb_id', $data->id)->get();

		// 	foreach ($result as $re) {
		// 		$resultTotal = DB::table('target_trial_balance')
		// 		->select('fiscal_year','month_name','entity_code','account_code','counterpart','custom','target_tb_id')
		// 		->where('fiscal_year', $re->fiscal_year)
		// 		->where('month_name', $re->month_name)
		// 		->where('entity_code', $re->entity_code)
		// 		->where('account_code', $data->account)
		// 		->where('counterpart', $data->counterpart)
		// 		->where('custom', $data->custom)
		// 		->where('target_tb_id','!=', $data->id)->get();
		// 	}
		// }
		// return response()->json($resultTotal);
	}

	// public function testadd(Request $request){
	// 	$datas = json_decode($request->datas);
	// 	$information = 1;

	// 	foreach ($datas as $data){
	// 		$result1 = DB::table('mapping_data_header')
	// 		->select('target_code1')
	// 		->where('entity_type_id','=',3)
	// 		->where('target_code1', $data->account)->distinct()->get();

	// 		if ($result1 != null) {

	// 			if ($data->counterpart == '[ICP None]') {
	// 				$result2 = '[ICP None]';		
	// 			}else{
	// 				$result2 = DB::table('mapping_data_header')
	// 				->select('target_code1')
	// 				->where('entity_type_id','=',2)
	// 				->where('target_code1', $data->counterpart)->distinct()->get();
	// 			}
	// 			// if ($data->counterpart == '[ICP None]') {
	// 			// 	$result2 == '[ICP None]';
	// 			// }

	// 			if ($result2 != null) {
	// 				$result3 = DB::table('mapping_data_header')
	// 				->select('target_code2')
	// 				->where('entity_type_id','=',3)
	// 				->where('target_code2', $data->custom)->distinct()->get();

	// 				if ($result3 == null) {
	// 					$information = 0;  //don't have data in mapping_data_header
	// 					return response()->json(["status" => 400, "data" => $data->custom, "type" => "custom"]);
	// 				}
	// 			}else{
	// 				$information = 0;  //don't have data in mapping_data_header
	// 				return response()->json(["status" => 400, "data" =>$data->counterpart, "type" =>"counterpart"]);
	// 			}
	// 		}else{
	// 			$information = 0; //don't have data in mapping_data_header
	// 			return response()->json(["status" => 400, "data" => $data->account, "type" => "account"]);
	// 		}		
	// 	}//check have data in table mapping_data_header

	// 	if ($information != 0) {
	// 		foreach ($datas as $data) {
	// 			$result = DB::table('target_trial_balance')
	// 			->select('fiscal_year', 'month_name','entity_code','account_code','counterpart','custom')
	// 			->where('fiscal_year', $data->year)
	// 			->where('month_name', $data->month)
	// 			->where('entity_code', $data->entity)
	// 			->where('account_code', $data->account)
	// 			->where('counterpart', $data->counterpart)
	// 			->where('custom', $data->custom)->distinct()->get();

	// 			if ($result == null) {
	// 				$dataSet = [];
	// 				foreach ($datas as $data) {
	// 					$dataSet[] = [
	// 						"fiscal_year" => $data->year,
	// 						"month_name" => $data->month,
	// 						"entity_code" => $data->entity,
	// 						"account_code" => $data->account,
	// 						"counterpart" => $data->counterpart,
	// 						"custom" => $data->custom,
	// 						"net_amount" => $data->net_amount
	// 					];
	// 				}
	// 				$resultInsert = DB::table("target_trial_balance")->insert($dataSet);
	// 				return response()->json(["status" => 200]);
	// 			}else{
	// 				//sam
	// 				return response()->json(["status" => 404, "data" => $data->account, "type" => "account"]);
	// 			}
	// 		}
	// 	}	
	// } 

	// public function testedit(Request $request){
	// 	$datas = json_decode($request->datas);

	// 	$ttt = "";

	// 	foreach ($datas as $data) {
	// 		$result = DB::table('target_trial_balance')
	// 		->select('fiscal_year','month_name','entity_code')
	// 		->where('target_tb_id', $data->id)->get();

	// 		foreach ($result as $re) {
	// 			$resultSQL = DB::table('target_trial_balance')
	// 			->select('fiscal_year','month_name','entity_code','account_code','counterpart','custom')
	// 			->where('fiscal_year', $re->fiscal_year)
	// 			->where('month_name', $re->month_name)
	// 			->where('entity_code', $re->entity_code)
	// 			->where('account_code', $data->account)
	// 			->where('counterpart', $data->counterpart)
	// 			->where('custom', $data->custom)
	// 			->where('target_tb_id','!=', $data->id)->get();

	// 			// return response()->json($resultSQL);	
	// 			if ($resultSQL == null) {
	// 				$sqlStr = "
	// 				UPDATE target_trial_balance
	// 				SET account_code = ?, counterpart = ?, custom = ?, net_amount = ?
	// 				WHERE target_tb_id = ?";

	// 				$dataSet = [];
	// 				foreach ($datas as $data) {
	// 					$result = DB::update($sqlStr, array($data->account, $data->counterpart, $data->custom, $data->net_amount, $data->id));
	// 				}

	// 			}else{
	// 				return response()->json(["status" => 401, "data" => $data->account, "type" => "account"]);
	// 			}			
	// 		}

	// 	}
	// 	return response()->json(["status" => 200]);
	// 	// return response()->json($resultSQL);
	// 	// return $ttt;	
	// }

}
