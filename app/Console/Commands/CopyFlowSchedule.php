<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Arr;

class CopyFlowSchedule extends Command
{
    protected $signature = 'copy-flow-schedule {path} {--provisory}';
    protected $description = 'Copy FLL Flow schedule';

    public function handle(): void
    {
        // This way it works both with a URL of a file path
        // Use the "Publikum" API URL https://flow.hands-on-technology.org/api/plans/xxx/visitor/schedule?role=14&expired=no
        $json = file_get_contents($this->argument('path'));

        $data = json_decode($json, true);

        $sessions = [];

        if ($this->option('provisory')) {
            $sessions[] = [
                'name' => 'Vorläufiges Programm',
                'color' => '#F9C428',
                'tasks' => [],
            ];
        }

        foreach ($data['groups'] as $group) {
            $originalGroupName = trim(Arr::get($group, 'group_meta.name'));

            if (str_contains($originalGroupName, 'Mittagessen')) {
                continue;
            }

            $session = [
                'name' => $this->translate($originalGroupName),
                'tasks' => [],
            ];

            switch (Arr::get($group, 'group_meta.first_program_name')) {
                case 'CHALLENGE':
                    $session['color'] = '#ED1C24';
                    break;
                case 'EXPLORE':
                    $session['color'] = '#00A651';
                    break;
                default:
                    $this->warn('Failed to identify category');
                    $session['color'] = '#666';
            }

            foreach ($group['activities'] as $activity) {
                $originalTaskName = trim(Arr::get($activity, 'meta.name'));

                $task = [
                    'time' => substr(trim(Arr::get($activity, 'start_time')), 11, 5) . '-' . substr(trim(Arr::get($activity, 'end_time')), 11, 5),
                    'name' => $this->translate($originalTaskName),
                    'location' => trim(Arr::get($activity, 'room.room_name')),
                ];

                if ($originalTaskName === 'Robot-Game Match') {
                    $task['teams'] = [
                        [
                            'team' => (int)Arr::get($activity, 'table_1_team_number_hot') /*?: 'Match à blanc'*/,
                            'table' => $this->translate(trim(Arr::get($activity, 'table_1_name'))),
                        ],
                        [
                            'team' => (int)Arr::get($activity, 'table_2_team_number_hot') /*?: 'Match à blanc'*/,
                            'table' => $this->translate(trim(Arr::get($activity, 'table_2_name'))),
                        ],
                    ];
                } else if ($originalTaskName === 'Jurygespräch') {
                    $task['team'] = (int)Arr::get($activity, 'jury_team_number_hot');
                }

                $session['tasks'][] = $task;
            }

            $sessions[] = $session;
        }

        $stringified = json_encode($sessions, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        file_put_contents(storage_path('app/schedule.json'), $stringified);
        file_put_contents(storage_path('app/matches.json'), $stringified);
        // If tasks were marked completed, a call to the moderation endpoint will be needed to re-apply
    }

    protected array $TRANSLATIONS = [
        // The main translations are done client-side. But here we can shorten or standardize some terms
        'Gemeinsame Preisverleihung' => 'Preisverleihung',
        'Eröffnung Explore (Nachmittag)' => 'Eröffnung Explore',
        'Tisch 1' => 'Table A',
        'Tisch 2' => 'Table B',
        'Tisch 3' => 'Table C',
        'Tisch 4' => 'Table D',
    ];

    protected array $REVERSE_TRANSLATIONS = [];

    protected function translate($text)
    {
        if (!array_key_exists($text, $this->TRANSLATIONS)) {
            return $text;
        }

        // For use in reverseTranslate() later
        $this->REVERSE_TRANSLATIONS[$this->TRANSLATIONS[$text]] = $text;

        return $this->TRANSLATIONS[$text];
    }

    protected function reverseTranslate($text)
    {
        return $this->REVERSE_TRANSLATIONS[$text] ?? $text;
    }
}
