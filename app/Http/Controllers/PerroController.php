<?php

namespace App\Http\Controllers;

use App\Models\Perro;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Spatie\FlareClient\Http\Response as HttpResponse;
use App\Http\Request\PerroRequest;

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
       }
    }

    public function getOnePerro(Request $request, PerroService $perroService)
    {
        try {
            $perro = Perro::find($request->id);

            if (!$perro) {
                return response()->json(['message' => 'Perro no encontrado'], Response::HTTP_NOT_FOUND);
            }

            if ($perro->url == null) {
                $imageUrl = $perroService->getRandomDogImage();
                $perro->url = $imageUrl;
                $perro->save();
            }

            return response()->json([
                'message' => 'Perro encontrado',
                'data' => $perro
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'Error al encontrar el perro'], Response::HTTP_BAD_REQUEST);
        }
    }


    

    public function getallPerros(Request $request, PerroService $perroService)
    {
    try {
        $perros = Perro::all();
        
        foreach ($perros as $perro) {
            if ($perro->url == null) {
                $imageUrl = $perroService->getRandomDogImage();
                $perro->url = $imageUrl;
                $perro->save();
            }
        }

        return response()->json([
            'message' => 'Perros encontrados',
            'error' => $perros
        ], Response::HTTP_OK);
    } catch (Exception $e) {
        Log::error($e->getMessage());
        return response()->json(['message' => 'Error al encontrar los perros'], Response::HTTP_BAD_REQUEST);
    }
    }


}
