<?php

namespace App\Http\Controllers;

use App\Models\Perro;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Spatie\FlareClient\Http\Response as HttpResponse;
use App\Http\Requests\PerroRequest;

class PerroController extends Controller
{
    public function createPerro(PerroRequest $request){
        try {
            $perro = new Perro();
            $perro->name = $request->name;
            $perro->url = $request->url;
            $perro->description = $request->descripcion;
            $perro->save();
            return response()->json([
                "message" => "Perro creado correctamente",
                "perro" => $perro], Response::HTTP_OK);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                "message" => "Error al crear el perro",
                "error" => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }
    public function viewPerro(PerroRequest $request){
        try {
            $perro = Perro::find($request->id);
            if ($perro) {
                return response()->json([
                    "message" => "Perro encontrado correctamente",
                    "perro" => $perro], Response::HTTP_OK); 
            }else {
                throw new Exception("El perro de id: $request->id no se encuentra en la base de datos");
            }
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                "message" => "Error al encontrar perro",
                "error" => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }


}