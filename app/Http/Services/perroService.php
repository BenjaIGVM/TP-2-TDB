<?php

namespace App\Http\Services;

use Illuminate\Support\Facades\Http;

class PerroService{
    public function ListPerros(){
        $url = 'https://dog.ceo/api/breeds/list/all?limit=10';
        $response = Http::get($url);
        return json_decode($response);
    }
    public function OnliDog(){
        $url = 'https://dog.ceo/api/breeds/image/random?';
        $response = Http::get($url . $id);
        return json_decode($response);
    }
    public function getRandomDogImage(): string
    {
        $maxAttempts = 5; 
            $attempts = 0;

        do {
            $url = 'https://dog.ceo/api/breeds/image/random';
            $response = Http::get($url);
            $data = json_decode($response->getBody(), true);

            if ($response->successful() && isset($data['message'])) {
                return $data['message'];
            }

            $attempts++;
        } while ($attempts < $maxAttempts);

        return 'https://dog.ceo/api/breeds/image/random'; 
        }
}
