<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use File;
use Storage;
use DB;
use GuzzleHttp\Client as GuzzleHttpClient;

class PageImportController extends Controller
{
	public function index(Request $request){

    	$import_max_size = 1024 * 1024 * 40;  //set max size
    	$importpath = "C:/Bitnami/wampstack-5.6.30-1/apache2/htdocs/api/upload/";
    	// $filename = iconv('UTF-8','windows-874',$f->getClientOriginalName()); //change name file
    	$name_simple = "Trial_Balance___Detail";

    	$successes = array(); 
    	$errors = array();

    	$user = $request->input('user');

    	foreach ($request->file() as $f) {
    		
    		$filename = iconv('UTF-8','windows-874',$f->getClientOriginalName()); //change name file
    		$start_at = date('Ymd H:i:s');
			if (($f->getClientSize() > $import_max_size) || ($name_simple != substr($filename,0,22))) {  //compare size

				$errors[] = [
					"filename" => $f->getClientOriginalName(),
					"size" => $f->getClientSize(),
					"errorMessage" => "This file size is greater than maximum file size limit."
				];
				return response()->json(["status" => 400, "error" => $errors, "name" => $filename]);
			} else {
				$filename = iconv('UTF-8','windows-874',$f->getClientOriginalName()); //change name file
				$f->move($importpath,$f->getClientOriginalName());	//move file		 	
				set_time_limit(300); 
				
			}		
		}
		return response()->json(["status" => 200, "error" => $errors, "name" => $filename, "user" => $user]); //return error and name file
	}

	public function import(Request $request){
		$execBy = $request->input('user');

		$import_max_size = 1024 * 1024 * 40;  //set max size
    	$importpath = "C:/Bitnami/wampstack-5.6.30-1/apache2/htdocs/api/upload/";
    	$name_simple = "Trial_Balance___Detail";

    	$successes = array(); 
    	$errors = array();
    	foreach ($request->file() as $f) {
    		$filename = iconv('UTF-8','windows-874',$f->getClientOriginalName()); //change name file
    		$start_at = date('Ymd H:i:s');
			if (($f->getClientSize() > $import_max_size) || ($name_simple != substr($filename,0,22))) {  //compare size
				$errors[] = [
					"name" => $f->getClientOriginalName(),
					"size" => $f->getClientSize(),
					"errorMessage" => "This file size is greater than maximum file size limit."
				];
				return response()->json(["status" => 400, "error" => $errors, "name" => $filename]);
			} else {
				$name = iconv('UTF-8','windows-874',$f->getClientOriginalName()); //change name file
				$f->move($importpath,$f->getClientOriginalName());	//move file		 	
				set_time_limit(300); 
				
		 		// run ETL
			}		
		}

		$filename = 'C:/Bitnami/wampstack-5.6.30-1/apache2/htdocs/api/upload/'.$name;
		try {

			$client = new GuzzleHttpClient();
			$apiRequest = $client->request('GET', 'http://localhost:9090/kettle/executeTrans',[
             	'auth' => ['cluster', 'cluster'], //If authentication required
             	'query' => [
             		'rep' => 'hfm_repo',
             		'user' => 'admin',
             		'pass' => 'admin',
             		'trans' => 'left_order_group',
             		'level' => 'Basic',
             		'file_location' => $filename
             	]
             ]);

			$respStatus_check =  $apiRequest->getStatusCode();
			$respHeader = $apiRequest->getHeader('content-type');
	        $respBody = $apiRequest->getBody()->getContents(); //$respBody = json_decode($apiRequest->getBody()->getContents());
	        $xml = simplexml_load_string($respBody);
	        $json = json_encode($xml);
	        $webresult_check = json_decode($json,TRUE);

	        // return response()->json(["status"=>$respStatus_check, "webresult" => $webresult_check]);

	        if ($respStatus_check == 200 && $webresult_check == false) {

	        	$result = DB::table('error')->select('type_code', 'type_name')->orderBy('type_name', 'asc')->get();

	        	if ($result == null) {
	        		// return response()->json(["status" => 200]);

    				//run etl save input data to database and mapping output
	        		$apiRequest = $client->request('GET', 'http://localhost:9090/kettle/executeTrans',[
             			'auth' => ['cluster', 'cluster'], //If authentication required
             			'query' => [
             				'rep' => 'hfm_repo',
             				'user' => 'admin',
             				'pass' => 'admin',
             				'trans' => 'HFM2',
             				'level' => 'Basic',
             				'file_location' => $filename,
             				'execBy' => $execBy
             			]
             		]);

	        		$respStatus_input =  $apiRequest->getStatusCode();
	        		$respHeader = $apiRequest->getHeader('content-type');
	        		$respBody = $apiRequest->getBody()->getContents(); //$respBody = json_decode($apiRequest->getBody()->getContents());
	        		$xml = simplexml_load_string($respBody);
	        		$json = json_encode($xml);
	        		$webresult_input = json_decode($json,TRUE);

	        		// return response()->json(["status"=>$respStatus, "webresult" => $webresult, "ETL" => "HFM2"]); 

	        		if ($respStatus_input == 200 && $webresult_input == false) {

	        			$apiRequest = $client->request('GET', 'http://localhost:9090/kettle/executeTrans',[
             			'auth' => ['cluster', 'cluster'], //If authentication required
             			'query' => [
			             	'rep' => 'hfm_repo',
			             	'user' => 'admin',
			             	'pass' => 'admin',
			             	'trans' => 'data_output',
			             	'level' => 'Basic',
			             	'execBy' => $execBy
             			]
         				]);
         				$respStatus_mapping =  $apiRequest->getStatusCode();
         				$respHeader = $apiRequest->getHeader('content-type');
		        		$respBody = $apiRequest->getBody()->getContents(); //$respBody = json_decode($apiRequest->getBody()->getContents());
		        		$xml = simplexml_load_string($respBody);
		        		$json = json_encode($xml);
		        		$webresult_mapping = json_decode($json,TRUE);

         				if ($respStatus_mapping == 200 && $webresult_mapping == false) {
         					return response()->json(["status" => 200, "execBy" => $execBy]);
         				}else{
         					return response()->json(["status" => 400, "part" => "Mapping"]);
         				}
	        		}    		
	        	}
	        	if ($result != null){    		
    				// return response()->json(["status" => 400, "error" => "error"]);
    				$filename_del = 'C:\\Bitnami\\wampstack-5.6.30-1\\apache2\\htdocs\\api\\upload\\'.$name;
	        		exec('del "'.$filename_del.'"');
	        		return response()->json($result);
	        	}
	        }if ($respStatus == 200 && $webresult != false) {
	        	return response()->json(["status" => 400, "part" => "Check"]);
	        }

	    } catch (RequestException $re) {
          //For handling exception
	    	// return $re->getResponse();
	    	return response()->json(["status" => 400, "part" => "ETL"]);
	    }
	}


    //user select run ETL
	public function http(Request $request){
		$filename = 'C:/Bitnami/wampstack-5.6.30-1/apache2/htdocs/api/upload/'.$request->filename;
		try {

			$client = new GuzzleHttpClient();
			$apiRequest = $client->request('GET', 'http://localhost:9090/kettle/executeTrans',[
             	'auth' => ['cluster', 'cluster'], //If authentication required
             	'query' => [
             		'rep' => 'hfm_repo',
             		'user' => 'admin',
             		'pass' => 'admin',
             		'trans' => 'left_order_group',
             		'level' => 'Basic',
             		'file_location' => $filename
             	]
             ]);

			$respStatus_check =  $apiRequest->getStatusCode();
			$respHeader = $apiRequest->getHeader('content-type');
	        $respBody = $apiRequest->getBody()->getContents(); //$respBody = json_decode($apiRequest->getBody()->getContents());
	        $xml = simplexml_load_string($respBody);
	        $json = json_encode($xml);
	        $webresult_check = json_decode($json,TRUE);

	        // return response()->json(["status"=>$respStatus_check, "webresult" => $webresult_check]);

	        if ($respStatus_check == 200 && $webresult_check == false) {

	        	$result = DB::table('error')->select('type_code', 'type_name')->orderBy('type_name', 'asc')->get();

	        	if ($result == null) {
	        		// return response()->json(["status" => 200]);

    				//run etl save input data to database and mapping output
	        		$apiRequest = $client->request('GET', 'http://localhost:9090/kettle/executeTrans',[
             			'auth' => ['cluster', 'cluster'], //If authentication required
             			'query' => [
             				'rep' => 'hfm_repo',
             				'user' => 'admin',
             				'pass' => 'admin',
             				'trans' => 'HFM2',
             				'level' => 'Basic',
             				'file_location' => $filename
             			]
             		]);

	        		$respStatus_input =  $apiRequest->getStatusCode();
	        		$respHeader = $apiRequest->getHeader('content-type');
	        		$respBody = $apiRequest->getBody()->getContents(); //$respBody = json_decode($apiRequest->getBody()->getContents());
	        		$xml = simplexml_load_string($respBody);
	        		$json = json_encode($xml);
	        		$webresult_input = json_decode($json,TRUE);

	        		// return response()->json(["status"=>$respStatus, "webresult" => $webresult, "ETL" => "HFM2"]); 

	        		if ($respStatus_input == 200 && $webresult_input == false) {

	        			$apiRequest = $client->request('GET', 'http://localhost:9090/kettle/executeTrans',[
             			'auth' => ['cluster', 'cluster'], //If authentication required
             			'query' => [
			             	'rep' => 'hfm_repo',
			             	'user' => 'admin',
			             	'pass' => 'admin',
			             	'trans' => 'data_output',
			             	'level' => 'Basic'
             			]
         				]);
         				$respStatus_mapping =  $apiRequest->getStatusCode();
         				$respHeader = $apiRequest->getHeader('content-type');
		        		$respBody = $apiRequest->getBody()->getContents(); //$respBody = json_decode($apiRequest->getBody()->getContents());
		        		$xml = simplexml_load_string($respBody);
		        		$json = json_encode($xml);
		        		$webresult_mapping = json_decode($json,TRUE);

         				if ($respStatus_mapping == 200 && $webresult_mapping == false) {
         					return response()->json(["status" => 200]);
         				}else{
         					return response()->json(["status" => 400, "part" => "Mapping"]);
         				}
	        		}    		
	        	}
	        	if ($result != null){    		
    				// return response()->json(["status" => 400, "error" => "error"]);
    				$filename_del = 'C:\\Bitnami\\wampstack-5.6.30-1\\apache2\\htdocs\\api\\upload\\'.$request->filename;
	        		exec('del "'.$filename_del.'"');
	        		return response()->json($result);
	        	}
	        }if ($respStatus == 200 && $webresult != false) {
	        	return response()->json(["status" => 400, "part" => "Check"]);
	        }

	    } catch (RequestException $re) {
          //For handling exception
	    	// return $re->getResponse();
	    	return response()->json(["status" => 400, "part" => "ETL"]);
	    }
	}

	public function del_file(){
    	//Then ETL have error [delete oldfile for import newfile]

		exec('del C:\Bitnami\wampstack-5.6.30-1\apache2\htdocs\api\upload\install.txt');
		return ("del");
	}

	public function check_error(){

		$result = DB::table('error')->select('type_code', 'type_name')->orderBy('type_name', 'asc')->get();

		if ($result == null) {
			return response()->json(["status" => 200]);
    		//run etl save input data to database and mapping output
		}
		if ($result != null){    		
    		// return response()->json(["status" => 400, "error" => "error"]);
			exec('del C:\Bitnami\wampstack-5.6.30-1\apache2\htdocs\api\upload\test_del.txt');
			return response()->json($result);
		}

    	// return response()->json($result);
	}




}
