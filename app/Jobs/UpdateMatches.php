<?php

namespace App\Jobs;

use App\Events\MatchesUpdated;
use GuzzleHttp\Utils;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;

class UpdateMatches implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public array $matches)
    {
    }

    public function handle()
    {
        $matches = Utils::jsonEncode($this->matches, JSON_PRETTY_PRINT);

        $current = null; // Use null so even a blank value will trigger a file update

        try {
            $current = Utils::jsonEncode(Utils::jsonDecode(Storage::get('matches.json') ?? ''), JSON_PRETTY_PRINT);
        } catch (InvalidArgumentException|FileNotFoundException $exception) {
            // ignore errors
        }

        if ($matches !== $current) {
            Storage::put('matches.json', $matches);

            broadcast(new MatchesUpdated($this->matches));
        }
    }
}
