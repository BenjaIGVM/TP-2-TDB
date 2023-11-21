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
            $perro->descripcion = $request->descripcion;
            $perro->save();
            return response()->json([
                "message" => "Perro creado correctamente",
                "perro" => $perro
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                "message" => "Error al crear el perro",
                "error" => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }


}
