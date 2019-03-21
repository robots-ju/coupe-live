<?php

namespace App\Jobs;

use App\Events\MatchesUpdated;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use InvalidArgumentException;
use Storage;

class UpdateMatches implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $matches;

    public function __construct(array $matches)
    {
        $this->matches = $matches;
    }

    public function handle()
    {
        $matches = \GuzzleHttp\json_encode($this->matches, JSON_PRETTY_PRINT);

        $current = null; // Use null so even a blank value will trigger a file update

        try {
            $current = \GuzzleHttp\json_encode(\GuzzleHttp\json_decode(Storage::get('matches.json')), JSON_PRETTY_PRINT);
        } catch (InvalidArgumentException|FileNotFoundException $exception) {
            // ignore errors
        }

        if ($matches !== $current) {
            Storage::put('matches.json', $matches);

            broadcast(new MatchesUpdated($this->matches));
        }
    }
}
