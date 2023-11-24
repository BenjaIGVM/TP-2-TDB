<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PerroController;
use App\Http\Controllers\InteraccionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix("perro")->group(function () {
    Route::post("create", "App\Http\Controllers\PerroController@createPerro");
    Route::get("getOne", "App\Http\Controllers\PerroController@getOnePerro");
    Route::get("getAll", "App\Http\Controllers\PerroController@getallPerros");
    Route::put("update", "App\Http\Controllers\PerroController@updatePerro");
    Route::delete("delete", "App\Http\Controllers\PerroController@deletePerro");
    Route::delete("deleteAll", "App\Http\Controllers\PerroController@deleteAllPerros");
    Route::get('random', "App\Http\Controllers\PerroController@getRandomPerro");
    Route::get('randomCandidato', "App\Http\Controllers\PerroController@getRandomCandidato");
    
});

Route::prefix("interaccion")->group(function () {
    Route::post("create", "App\Http\Controllers\InteraccionController@createInteraccion");
    Route::get("getAll", "App\Http\Controllers\InteraccionController@getAllInteracciones");
    Route::get("getAceptados", "App\Http\Controllers\InteraccionController@getPerrosAceptados");
    Route::get("getRechazados", "App\Http\Controllers\InteraccionController@getPerrosRechazados");
    Route::put("update", "App\Http\Controllers\InteraccionController@updateInteraccion");
    Route::delete("delete", "App\Http\Controllers\InteraccionController@deleteInteraccion");
});
