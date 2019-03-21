<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Filesystem\FileNotFoundException;
use InvalidArgumentException;
use Storage;

class AppController extends Controller
{
    public function home()
    {
        $stream = '';
        $matches = [];

        try {
            $stream = Storage::get('stream.txt');

            try {
                $matches = \GuzzleHttp\json_decode(Storage::get('matches.json'));
            } catch (InvalidArgumentException $exception) {
                // ignore errors
            }
        } catch (FileNotFoundException $exception) {
            // ignore errors
        }

        return view('app')
            ->withStream(\GuzzleHttp\json_encode($stream))
            ->withMatches(\GuzzleHttp\json_encode($matches));
    }
}
