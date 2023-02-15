<?php

namespace App\Http\Controllers;

use GuzzleHttp\Utils;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;

class AppController extends Controller
{
    public function home()
    {
        $stream = '';
        $matches = [];

        try {
            $stream = Storage::get('stream.txt');

            try {
                $matches = Utils::jsonDecode(Storage::get('matches.json') ?? '[]');
            } catch (InvalidArgumentException $exception) {
                // ignore errors
            }
        } catch (FileNotFoundException $exception) {
            // ignore errors
        }

        return view('app')
            ->withStream(Utils::jsonEncode($stream))
            ->withMatches(Utils::jsonEncode($matches));
    }
}
