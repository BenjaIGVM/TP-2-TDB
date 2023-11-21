<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Interaccion extends Model
{
    use HasFactory;

    protected $table = 'interacciones';
    public $timestamps = true;
    protected $fillable = [
        "iDperroInteresado",
        "iDperroCandidato",
        "preferencia"
    ];

}
