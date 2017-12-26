<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use DB;
use App\MappingDataHeader;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use DateTime;
use App\Http\Controllers\Validator;
use Illuminate\Database\Query\Builder;

class PageInputController extends Controller
{
	public function index(Request $request){
		$insearch = $request->insearch;
		$searchStr = $request->searchStr;

		$sqlStr = "
		SELECT mapping_data_id, source_code, target_code1, target_code2, fs_line, note
		FROM mapping_data_header
		WHERE entity_type_id = {$insearch} ";					

		if (empty($request->searchStr)) {
		}else{
			$sqlStr = $sqlStr."
			AND (source_code LIKE '{$searchStr}' OR target_code1 LIKE '{$searchStr}' OR target_code2 LIKE '{$searchStr}')";			
		}
		$sqlStr = $sqlStr."ORDER BY source_code ASC";		
		$result = DB::select($sqlStr);
		return response()->json($result);
	}

	public function add(Request $request){
		$datas = json_decode($request->datas);

		$dataSame = [];
		$now = new DateTime();
		foreach ($datas as $data){
			$dataSame[] = [
				"entity_type_id" => $data->type,
				"account_type" => $data->account,
				"source_code" => $data->source,
				"target_code1" => $data->target1,
				"target_code2" => $data->target2,
				"fs_line" => $data->fs_line,
				"note" => $data->note,
				"created_by" => $data->create_by,
				"created_dttm" => $now,
				"updated_by" => $data->update_by,
				"updated_dttm" => $now
			];

			$sqlResults = DB::table('mapping_data_header')
			->select('source_code')
			->where('entity_type_id','=',$data->type)->distinct()->get();
		}
		
		$result_same = 0;
		$data_pass = [];
		foreach ($sqlResults as $result) {
			if (!in_array($result->source_code, array_column($dataSame, "source_code"))) {
				// $result_same = 0;
			}
			if (in_array($result->source_code, array_column($dataSame, "source_code"))) {
				$result_same = 1;
				return response()->json(["status" => 400, "data" => $result->source_code]);
			}
		}

		if ($result_same == 0) {
			$insertResult = DB::table("mapping_data_header")->insert($dataSame);
			return response()->json(["status" => 200]);
		}
	}

	public function del(Request $request){
		$datas = json_decode($request->datas);

		foreach ($datas as $data) {
			$i = MappingDataHeader::findOrFail($data->id);
			$i->delete();			
		}	
		return response()->json(['status' => 200]);
	}

	public function edit(Request $request){
		$datas = json_decode($request->datas);
		$now = new DateTime();

		$sqlStr = "
		UPDATE mapping_data_header
		SET account_type = ?, source_code= ?, target_code1 = ?, target_code2 = ?, updated_by = ?, updated_dttm = ?, fs_line = ?, note = ?
		WHERE mapping_data_id = ?";

		$dataSet = [];
		foreach ($datas as $data) {
			$result = DB::update($sqlStr, array($data->account, $data->source, $data->target1, $data->target2, $data->update_by, $now, $data->fs_line, $data->note, $data->id));
		}
		return response()->json(["status" => 200]);
	}
}

	// public function edit(Request $request){
	// 	$datas = json_decode($request->datas);

	// 	$dataSame = [];
	// 	foreach ($datas as $data){
	// 		$dataSame[] = [
	// 			"source_code" => $data->source,
	// 			"mapping_data_id" => $data->id
	// 		];

	// 		$sqlType = DB::table('mapping_data_header')
	// 		->select('entity_type_id','mapping_data_id')
	// 		->where('mapping_data_id','=',$data->id)->distinct()->get();		
	// 	}
	// 	// return response()->json($sqlType);

	// 	foreach ($sqlType as $key => $value) {
	// 		$sqlResults = DB::table('mapping_data_header')
	// 		->select('source_code')
	// 		->where('mapping_data_id','!=',$value->mapping_data_id)
	// 		->where('entity_type_id','=',$value->entity_type_id)->distinct()->get();
	// 	}
	// 	// return response()->json($sqlResults);

	// 	$result_same = 0;
	// 	$data_pass = [];
	// 	foreach ($sqlResults as $result) {
	// 		if (!in_array($result->source_code, array_column($dataSame, "source_code"))) {
	// 			// $result_same = 0;
	// 		}
	// 		if (in_array($result->source_code, array_column($dataSame, "source_code"))) {
	// 			$result_same = 1;
	// 			return response()->json(["status" => 400, "data" => $result->source_code]);
	// 		}
	// 	}

	// 	if ($result_same == 0) {
	// 		$now = new DateTime();

	// 		$sqlStr = "
	// 		UPDATE mapping_data_header
	// 		SET account_type = ?, source_code= ?, target_code1 = ?, target_code2 = ?, updated_by = ?, updated_dttm = ?, fs_line = ?, note = ?
	// 		WHERE mapping_data_id = ?";

	// 		$dataSet = [];
	// 		foreach ($datas as $data) {
	// 			$result = DB::update($sqlStr, array($data->account, $data->source, $data->target1, $data->target2, $data->update_by, $now, $data->fs_line, $data->note, $data->id));
	// 		}
	// 		return response()->json(["status" => 200]);
	// 	}
	// }
	
