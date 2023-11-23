<?php

namespace App\Repositories;

use App\Models\Perro;
use App\Models\Interaccion;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Response;
use Exception;

class PerroRepository{
    public function registerPerro($request){
        try {
            $perro = new Perro();
            $perro->name = $request->name;
            $perro->url = $request->url;
            $perro->description = $request->description;
            $perro->save();
            return response()->json([
                'message' => 'Perro creado correctamente',
                'error' => $perro ], Response::HTTP_OK);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'Error al crear el perro'], Response::HTTP_BAD_REQUEST);
        }
    }
}