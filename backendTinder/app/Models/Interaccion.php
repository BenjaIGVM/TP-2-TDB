<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\Perro;

class Interaccion extends Model
{
    use HasFactory;
    protected $table = 'interacciones';
    protected $fillable = [
        'perro_interesado_id',
        'perro_candidato_id',
        'preferencia',
    ];
    public $timestamps = true;

    public function perro_interesado()
    {
        return $this->belongsTo(Perro::class, 'perro_interesado_id');
    }
    public function perro_candidato()
    {
        return $this->belongsTo(Perro::class, 'perro_candidato_id');
    }
}
