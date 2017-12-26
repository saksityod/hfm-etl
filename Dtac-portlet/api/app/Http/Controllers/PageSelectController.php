<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\Http\Requests;
// use App\Http\Controllers\DB;

class PageSelectController extends Controller
{
    //
	public function index(){

		$sqlStr = "
		SELECT entity_type_id, entity_type_name  FROM mapping_type";

		$result = DB::select($sqlStr);

		return response()->json($result);
	}

	public function complete(Request $request){
		$insearch = $request->insearch;

		$sqlStr = "
		SELECT DISTINCT source_code
		FROM mapping_data_header WHERE entity_type_id = ?
		UNION SELECT DISTINCT target_code1 
		FROM mapping_data_header WHERE entity_type_id = ? 
		UNION SELECT DISTINCT target_code2 
		FROM mapping_data_header WHERE entity_type_id = ? AND target_code2 != 'NULL' ";

		$result = DB::select($sqlStr, array($insearch, $insearch, $insearch));
		$result = collect($result)->toArray();

		$resultArr = array();
		foreach ($result as $key => $value) {
			array_push($resultArr, $value->source_code);
		}

		return response()->json($resultArr);
	}
}
