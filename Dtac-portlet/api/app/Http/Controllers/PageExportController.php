<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use push;
use File;
use App\Http\Requests;
use App\TargetTrialBalance;
use Response;
// use Illuminate\Database\Eloquent\ModelNotFoundException;

class PageExportController extends Controller
{
	public function index(Request $request){
		$datas = json_decode($request->datas);
		
		foreach ($datas as $data) {
			$qry = DB::table('target_trial_balance')->select('entity_code', 'account_code', 'counterpart', 'custom', 'net_amount')
			-> where('fiscal_year', $data->year)
			-> where('month_name', $data->month)
			-> whereIn('entity_code', $data->entity)
			-> orderBy('entity_code', 'asc')
			-> orderBy('account_code', 'asc')
			-> orderBy('custom', 'asc')
			-> get();

			foreach ($qry as $key => $value) {
				if ($value->net_amount == '.00') {
					$value->net_amount = '0.00';
				}
			}

			$namefile = $data->year; //name year
			$name_month = $data->month; //name month for change to number
			$entity = $data->entity[0]; //name entity one in array
		}

		//change name month to number month
		$num_month = ($name_month == 'January' ? 1 : 
			($name_month == 'February' ? 2 : 
			($name_month == 'March' ? 3 :
			($name_month == 'April' ? 4 :
			($name_month == 'May' ? 5 : 
			($name_month == 'June' ? 6 : 
			($name_month == 'July' ? 7 : 
			($name_month == 'August' ? 8 : 
			($name_month == 'September' ? 9 : 
			($name_month == 'October' ? 10 : 
			($name_month == 'November' ? 11 : 12
		)))))))))));

		// if ($name_month == 'January'){$num_month = 1;}
		// if ($name_month == 'February'){$num_month = 2;}
		// if ($name_month == 'March'){$num_month = 3;}
		// if ($name_month == 'April'){$num_month = 4;}
		// if ($name_month == 'May'){$num_month = 5;}
		// if ($name_month == 'June'){$num_month = 6;}
		// if ($name_month == 'July'){$num_month = 7;}
		// if ($name_month == 'August'){$num_month = 8;}
		// if ($name_month == 'September'){$num_month = 9;}
		// if ($name_month == 'October'){$num_month = 10;}
		// if ($name_month == 'November'){$num_month = 11;}
		// if ($name_month == 'December'){$num_month = 12;}
		//end change name month to number month

		$namefile = $namefile.'_'.$num_month.'_'.$entity;

		if ($qry == null) {
			//don't have data
			return response()->json(["status" => 400]);
			
		}if ($qry != null) {
			$qry = collect($qry)->toArray();
			$data = "";

			foreach ($qry as $key) {
				$data = $data.$key->entity_code.";".
				$key->account_code.";".
				$key->counterpart.";".
				$key->custom.";".
				$key->net_amount."\r\n";		
			}

			foreach ($datas as $hed){
				$head = "!YEAR=".str_pad($hed->year,4," ",STR_PAD_RIGHT)."\r\n!PERIOD=".str_pad($hed->month,4," ",STR_PAD_RIGHT)."\r\n!VALUE=THB\r\n!SCENARIO=Actual\r\n!VIEW=YTD\r\n!CUSTOM2=[None]\r\n!CUSTOM3=[None]\r\n!CUSTOM4=IMPFILE\r\n!column_order=entity, account, ICP, custom1\r\n\r\n!DATA\r\n";	
			}
			
			$data = $head.$data;
			
			// $fileName = 'export_data.txt';
			$fileName = $namefile.'.dat';
			File::put('C:/Bitnami/wampstack-5.6.30-1/apache2/htdocs/api/upload/export/'.$fileName,$data);
			return Response::download('C:/Bitnami/wampstack-5.6.30-1/apache2/htdocs/api/upload/export/'.$fileName);
		}
	}

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


	// public function test(Request $request){

	// 	$data = "!YEAR=".str_pad($request->year,4," ",STR_PAD_RIGHT)."\r\n!PERIOD=".str_pad($request->month,4," ",STR_PAD_RIGHT)."\r\n!VALUE=THB\r\n!SCENARIO=Actual\r\n!VIEW=YTD\r\n!CUSTOM2=[None]\r\n!CUSTOM3=[None]\r\n!CUSTOM4=IMPFILE\r\n!column_order=entity, account, ICP, custom1\r\n\r\n!DATA\r\n";
	// 	$fileName = 'test.txt';
	// 	File::put('C:/Bitnami/wampstack-5.6.30-1/apache2/htdocs/api/upload/export/'.$fileName,$data);
	// 	return Response::download('C:/Bitnami/wampstack-5.6.30-1/apache2/htdocs/api/upload/export/'.$fileName);

	// }

	// public function downloadTxt()
	// {
	// 	$data = "MMMMMMMMMMMMMMMMMMMMMMMMMMMM";
	// 	$fileName = 'test.txt';
	// 	File::put('C:/Bitnami/wampstack-5.6.30-1/apache2/htdocs/api/upload/export/'.$fileName,$data);
	// 	return Response::download('C:/Bitnami/wampstack-5.6.30-1/apache2/htdocs/api/upload/export/'.$fileName);
	// }
}
