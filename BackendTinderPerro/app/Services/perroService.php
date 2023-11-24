<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class PerroService{
   
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