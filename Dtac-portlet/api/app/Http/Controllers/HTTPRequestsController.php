<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use GuzzleHttp\Client as GuzzleHttpClient;
use GuzzleHttp\Exception\RequestException;

class HTTPRequestsController extends Controller
{
  public function index(Request $request){
    $filename = 'D:/MAPPING_DTAC/'.$request->filename;
    ///
    $execBy = $request->execBy;
    ///
    try {

           $client = new GuzzleHttpClient();
           $apiRequest = $client->request('GET', 'http://localhost:9090/kettle/executeTrans',[
             'auth' => ['cluster', 'cluster'], //If authentication required
             'query' => [
                'rep' => 'etl',
                'user' => 'admin',
                'pass' => 'admin',
                'trans' => 'left_order_group',
                'level' => 'Basic',
                'file_location' => $filename
              ]
          ]);

          $respStatus =  $apiRequest->getStatusCode();
          $respHeader = $apiRequest->getHeader('content-type');
          $respBody = $apiRequest->getBody()->getContents(); //$respBody = json_decode($apiRequest->getBody()->getContents());
          $xml = simplexml_load_string($respBody);
          $json = json_encode($xml);
          $array = json_decode($json,TRUE);

          return response()->json(["status"=>$respStatus, "webresult" => $array]); //htmlentities($respBody)

      } catch (RequestException $re) {
          //For handling exception
          return $re->getResponse();
      }
  }

  public function input(Request $request){
    // $exerBy = $request->input('user');
    $execBy = $request->user;
    $filename = 'C:/Bitnami/wampstack-5.6.30-1/apache2/htdocs/api/upload/'.$request->filename;
    try {

           $client = new GuzzleHttpClient();
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

          $respStatus =  $apiRequest->getStatusCode();
          $respHeader = $apiRequest->getHeader('content-type');
          $respBody = $apiRequest->getBody()->getContents(); //$respBody = json_decode($apiRequest->getBody()->getContents());
          $xml = simplexml_load_string($respBody);
          $json = json_encode($xml);
          $array = json_decode($json,TRUE);

          return response()->json(["status"=>$respStatus, "webresult" => $array]); //htmlentities($respBody)

      } catch (RequestException $re) {
          //For handling exception
          return $re->getResponse();
      }
  }

  public function mapping(Request $request){
     $execBy = $request->user;
    // $filename = 'D:/MAPPING_DTAC/'.$request->filename;
    try {

           $client = new GuzzleHttpClient();
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

          $respStatus =  $apiRequest->getStatusCode();
          $respHeader = $apiRequest->getHeader('content-type');
          $respBody = $apiRequest->getBody()->getContents(); //$respBody = json_decode($apiRequest->getBody()->getContents());
          $xml = simplexml_load_string($respBody);
          $json = json_encode($xml);
          $array = json_decode($json,TRUE);

          return response()->json(["status"=>$respStatus, "webresult" => $array]); //htmlentities($respBody)

      } catch (RequestException $re) {
          //For handling exception
          return $re->getResponse();
      }
  }
}