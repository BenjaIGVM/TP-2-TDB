<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Response;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;


class interaccionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    // public function authorize()
    // {
    //     return true;
    // }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'perro_interesado_id' => 'required|integer',
            'perro_candidato_id' => 'required|integer',
            'preferencia' => 'required|string|in:aceptado,rechazado',
        ];
    }
    

    public function messages()
    {
    return[
        'perro_interesado_id.required' => 'La id del perro interesado es obligatoria',
        'perro_interesado_id.integer' => 'La id del perro interesado debe ser un entero',
        'perro_candidato_id.required' => 'La id del perro candidato es obligatoria',
        'perro_candidato_id.integer' => 'La id del perro candidato debe ser un entero',
        'preferencia.required' => 'La "Preferencia" es obligatoria',
        'preferencia.string' => 'La preferencia debe ser un string',
        'preferencia.in' => 'La preferencia debe ser "aceptado" o "rechazado"',
    ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json($validator->errors()->all(), Response::HTTP_BAD_REQUEST));
    }
}

