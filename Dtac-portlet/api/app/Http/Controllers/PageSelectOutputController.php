<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\Http\Requests;

class PageSelectOutputController extends Controller
{
	public function entity(){

		$result = DB::table('target_trial_balance')->select('entity_code')
			->distinct()->orderBy('entity_code', 'asc')->get();

		return response()->json($result);
	}

	public function year(){

		$result = DB::table('target_trial_balance')->select('fiscal_year')
			->distinct()->orderBy('fiscal_year', 'asc')->get();

		return response()->json($result);
	}

	public function month(){

		$result = DB::table('target_trial_balance')->select('month_name')
			->distinct()->orderBy('month_name', 'asc')->get();

		return response()->json($result);
	}
}