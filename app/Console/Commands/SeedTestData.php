<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Storage;

class SeedTestData extends Command
{
    protected $signature = 'testdata:seed';
    protected $description = 'Import test data';

    public function handle()
    {
        Storage::put('stream.txt', 'dQw4w9WgXcQ');
        Storage::put('matches.json', \GuzzleHttp\json_encode([
            [
                'time' => '14:00',
                'tables' => [
                    [
                        'table' => 'A',
                        'team' => 'falcon',
                        'score' => 142,
                        'scoreboard' => null,
                    ],
                    [
                        'table' => 'B',
                        'team' => 'jurapiter',
                        'score' => 120,
                        'scoreboard' => '11111111111',
                    ],
                ],
            ],
            [
                'time' => '14:05',
                'tables' => [
                    [
                        'table' => 'C',
                        'team' => 'la5',
                        'score' => 30,
                        'scoreboard' => '1111111111',
                    ],
                    [
                        'table' => 'D',
                        'team' => 'jurapollo',
                        'score' => null,
                        'scoreboard' => null,
                    ],
                ],
            ],
        ], JSON_PRETTY_PRINT));
    }
}
