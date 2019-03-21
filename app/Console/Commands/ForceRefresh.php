<?php

namespace App\Console\Commands;

use App\Events\MatchesUpdated;
use App\Events\StreamUpdated;
use Illuminate\Console\Command;
use Storage;

class ForceRefresh extends Command
{
    protected $signature = 'refresh:force';
    protected $description = 'Broadcast existing data again';

    public function handle()
    {
        broadcast(new MatchesUpdated(\GuzzleHttp\json_decode(Storage::get('matches.json'))));
        broadcast(new StreamUpdated(Storage::get('stream.txt')));
    }
}
