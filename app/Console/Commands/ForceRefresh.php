<?php

namespace App\Console\Commands;

use App\Events\MatchesUpdated;
use App\Events\StreamUpdated;
use GuzzleHttp\Utils;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class ForceRefresh extends Command
{
    protected $signature = 'refresh:force';
    protected $description = 'Broadcast existing data again';

    public function handle()
    {
        broadcast(new MatchesUpdated(Utils::jsonDecode(Storage::get('matches.json') ?? '[]')));
        broadcast(new StreamUpdated(Storage::get('stream.txt')));
    }
}
