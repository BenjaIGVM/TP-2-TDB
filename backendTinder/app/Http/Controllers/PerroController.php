<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Perro;

use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Spatie\FlareClient\Http\Response as HttpResponse;
use App\Http\Requests\perroRequest;
use App\Services\perroService;

use Exception;

class PerroController extends Controller
{
    public function createPerro(perroRequest $request)
    {
        try {
            $perro = new Perro();
            $perro->name = $request->name;
            $perro->url = $request->url;
            $perro->description = $request->description;
            $perro->save();

            return response()->json([
                'message' => 'Perro creado correctamente',
                'data' => $perro
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'Error al crear el perro'], Response::HTTP_BAD_REQUEST);
        }
    }


    public function getOnePerro(Request $request, PerroService $perroService)
    {

        try {
            $perro = Perro::find($request->id);
            if (!$perro) {
                return response()->json(['message' => 'Perro no encontrado'], Response::HTTP_NOT_FOUND);
            }

            if ($perro->url == '') {
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

    public function getRandomPerro()
    {
        try {
            $perro = Perro::inRandomOrder()->first();

            if (!$perro) {
                return response()->json(['message' => 'No se encontraron perros en la base de datos'], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                'message' => 'Perro aleatorio encontrado',
                'data' => [
                    'id' => $perro->id,
                    'name' => $perro->name,
                ]

            ], Response::HTTP_OK);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'Error al obtener el perro aleatorio'], Response::HTTP_BAD_REQUEST);
        }
    }
    public function getRandomCandidato(Request $request, PerroService $perroService)
    {
        try {
            $perro_interesado = Perro::find($request->id);

            if (!$perro_interesado) {
                return response()->json(['message' => 'Perro interesado no encontrado'], Response::HTTP_NOT_FOUND);
            }

            $perro_candidato = Perro::where('id', '!=', $request->id)->inRandomOrder()->first();

            if (!$perro_candidato) {
                return response()->json(['message' => 'No se encontraron candidatos en la base de datos'], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                'message' => 'Candidato aleatorio encontrado',
                'data' => [
                    'id' => $perro_candidato->id,
                    'name' => $perro_candidato->name,
                ]
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'Error al obtener el candidato aleatorio'], Response::HTTP_BAD_REQUEST);
        }
    }


    public function getallPerros(Request $request, PerroService $perroService)
    {
        try {

            if($request->showSoftDelete){
                $perros = Perro::withTrashed()->get();
            }else{
                $perros = Perro::all();
            }


            if ($perros->isEmpty()) {

                return response()->json([
                    'message' => 'No hay perros'
                ], Response::HTTP_OK);

            } else {

                foreach ($perros as $perro) {
                    if ($perro->url == '') {
                        $imageUrl = $perroService->getRandomDogImage();
                        $perro->url = $imageUrl;
                        $perro->save();
                    }
                }

                return response()->json([
                    'message' => 'Perros encontrados',
                    'data' => $perros
                ], Response::HTTP_OK);

            }

        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'Error al encontrar los perros'], Response::HTTP_BAD_REQUEST);
        }
    }

    public function updatePerro(perroRequest $request)
    {
        try {
            $perro = Perro::find($request->id);
            if (!$perro) {
                return response()->json([
                    'message' => 'No existe el perro con esa id'
                ], Response::HTTP_OK);

            } else {
                $perro->name = $request->name;
                $perro->url = $request->url;
                $perro->description = $request->description;
                $perro->save();
                return response()->json([
                    'message' => 'Perro actualizado correctamente',
                    'data' => $perro
                ], Response::HTTP_OK);


            }
        } catch (Exception $e) {
            return response()->json(["error" => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    public function deletePerro(Request $request)
    {
        try {

            $perro = Perro::find($request->id);
            if (!$perro) {

                return response()->json([
                    'message' => 'No hay perro con esa id'
                ], Response::HTTP_OK);


            } else {
                $perro->delete();

                return response()->json([
                    'message' => 'Perro eliminado correctamente',
                    'data' => $perro
                ], Response::HTTP_OK);

            }
        } catch (Exception $e) {
            return response()->json(["error" => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    public function deleteAllPerros(Request $request)
    {
        try {
            Perro::getQuery()->delete();

            return response()->json([
                'message' => 'Todos los perros han sido eliminados correctamente',
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json(["error" => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }



}