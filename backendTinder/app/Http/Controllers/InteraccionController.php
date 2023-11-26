<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Interaccion;
use App\Models\Perro;

use Illuminate\Http\Response;
use App\Http\Requests\interaccionRequest;
use App\Http\Requests\interaccionUpdateRequest;
use Exception;
use Illuminate\Support\Facades\Log;
use Spatie\FlareClient\Http\Response as HttpResponse;

class InteraccionController extends Controller
{
    public function createInteraccion(interaccionRequest $request)
    {
        try {

            if (
                $request->perro_interesado_id == $request->perro_candidato_id ||
                !(Perro::where('id', $request->perro_interesado_id)->exists()) || !Perro::where('id', $request->perro_candidato_id)->exists()
            ) {

                return response()->json([
                    'error' => 'La id de algun perro ingresado no es correcta.',
                ], Response::HTTP_BAD_REQUEST);
            }

            $match = Interaccion::where('perro_interesado_id', $request->perro_candidato_id)
                ->where('perro_candidato_id', $request->perro_interesado_id)->where('preferencia', 'aceptado')
                ->first();

            $interaccion = new Interaccion();
            $interaccion->perro_interesado_id = $request->perro_interesado_id;
            $interaccion->perro_candidato_id = $request->perro_candidato_id;
            $interaccion->preferencia = $request->preferencia;
            $interaccion->save();

            $matchMessage = $match && $interaccion->preferencia == 'aceptado' ? '¡Has echo un match!' : '';

            return response()->json([
                'message' => 'Interaccion creada correctamente',
                'data' => $interaccion,
                'match_message' => $matchMessage,
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json(["error" => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    public function getAllInteracciones(Request $request)
    {
        try {
            $interacciones = Interaccion::all();
            return response()->json([
                'message' => 'Interacciones encontradas',
                'data' => $interacciones
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'Error al encontrar las interacciones'], Response::HTTP_BAD_REQUEST);
        }
    }
    public function updateInteraccion(interaccionUpdateRequest $request)
    {
        try {
            $interaccion = Interaccion::find($request->id);

            if (!$interaccion) {
                return response()->json([
                    'message' => 'No existe una interaccion con esa id'
                ], Response::HTTP_OK);

            } else {

                $interaccion->preferencia = $request->preferencia;
                $interaccion->save();
                return response()->json([
                    'message' => 'Interaccion actualizada correctamente',
                    'data' => $interaccion
                ], Response::HTTP_OK);

            }
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'Error al actualizar la interaccion'], Response::HTTP_BAD_REQUEST);
        }
    }
    public function deleteInteraccion(Request $request)
    {
        try {
            $interaccion = Interaccion::find($request->id);
            if (!$interaccion) {
                return response()->json([
                    'message' => 'No existe una interaccion con esa id'
                ], Response::HTTP_OK);

            } else {
                $interaccion->delete();
                return response()->json([
                    'message' => 'Interaccion eliminada correctamente',
                    'data' => $interaccion
                ], Response::HTTP_OK);
            }
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'Error al eliminar la interaccion'], Response::HTTP_BAD_REQUEST);
        }
    }
    public function getInteraccionesByPerro(Request $request)
    {
        try {
            $interacciones = Interaccion::where('perro_interesado_id', $request->id)->get();

            return response()->json([
                'message' => 'Interacciones encontradas',
                'data' => $interacciones
            ], Response::HTTP_OK);

        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'Error al encontrar las interacciones'], Response::HTTP_BAD_REQUEST);
        }
    }


    public function getPerrosAceptados(Request $request)
    {
        try {
            $perro_interesado_id = $request->perro_interesado_id;

            $perrosAceptados = Interaccion::where('perro_interesado_id', $perro_interesado_id)
                ->where('preferencia', 'aceptado')
                ->get();

            return response()->json([
                'message' => 'Perros aceptados obtenidos correctamente',
                'data' => $perrosAceptados
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'Error al obtener perros aceptados'], Response::HTTP_BAD_REQUEST);
        }
    }

    public function getPerrosRechazados(Request $request)
    {
        try {
            $perro_interesado_id = $request->perro_interesado_id;

            $perrosRechazados = Interaccion::where('perro_interesado_id', $perro_interesado_id)
                ->where('preferencia', 'rechazado')
                ->get();

            return response()->json([
                'message' => 'Perros rechazados obtenidos correctamente',
                'data' => $perrosRechazados
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'Error al obtener perros rechazados'], Response::HTTP_BAD_REQUEST);
        }
    }
    public function deleteAllInteracciones(Request $request)
    {
        try {
            Interaccion::getQuery()->delete();

            return response()->json([
                'message' => 'Todas las interacciones han sido eliminadas correctamente',
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json(["error" => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

}
