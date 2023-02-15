<?php

namespace App\Console\Commands;

use GuzzleHttp\Utils;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class SeedTestData extends Command
{
    protected $signature = 'testdata:seed';
    protected $description = 'Import test data';

    public function handle()
    {
        Storage::put('stream.txt', 'PReKHsXvmO4'); // Live stream 2019
        Storage::put('matches.json', Utils::jsonEncode([
            [
                'number' => 1,
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
                'number' => 2,
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
