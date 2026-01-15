<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\DomCrawler\Crawler;

class CopyFlowSchedule extends Command
{
    protected $signature = 'copy-flow-schedule {path}';
    protected $description = 'Copy FLL Flow schedule';

    // By chance, it works well this time as the only German team has the evaluation period alone
    protected array $GERMAN_TEAMS = [
        '1370',
    ];

    public function handle(): void
    {
        // This way it works both with a URL of a file path
        // Use the "Publikum" CGI URL https://flow.hands-on-technology.org/output/zeitplan.cgi?plan=xxxx&brief=no&expired=yes&now=&role=6&export=
        $html = file_get_contents($this->argument('path'));

        $crawler = new Crawler($html);

        $ignoreRootItems = true;

        $sessions = [];

        $crawler->filter('.container-fluid > div')->each(function (Crawler $sessionNode) use (&$ignoreRootItems, &$sessions) {
            $id = $sessionNode->attr('id');

            if ($ignoreRootItems) {
                // Ignore everything above #detailplan
                if ($id === 'detailplan') {
                    $ignoreRootItems = false;
                }

                $this->info('Skipping ' . $sessionNode->nodeName() . '#' . $id);

                return;
            }

            // When we reach the .container below the program that doesn't have an ID, it's the end
            if ($id === null && $sessionNode->attr('class') === 'container') {
                $ignoreRootItems = true;
                return;
            }

            if (preg_match('~^[0-9]+$~', $id) !== 1) {
                $this->warn("Unexpected DIV ID at root level #$id");
                return;
            }

            $titleNode = $sessionNode->children('span');

            $session = [
                'name' => $this->translate(trim($titleNode->text())),
                'tasks' => [],
            ];

            if (preg_match('~background-color:([^;]+);~', $titleNode->attr('style'), $colorMatches) === 1) {
                $session['color'] = $colorMatches[1];
            } else {
                $this->warn('Failed to extract color');
                $this->line($titleNode->outerHtml());
            }

            $sessionNode->children('div')->each(function (Crawler $taskNode) use (&$session) {
                $taskHtml = trim($taskNode->html());

                if (preg_match('~^<strong>([0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2})</strong>\s*<br>([^<]+)<span[^>]+>(.+)<i class="bi-geo"></i>(.+)$~', $taskHtml, $matches) !== 1) {
                    $this->warn('Failed to parse task');
                    $this->line($taskHtml);
                }

                $originalTaskName = trim($matches[2]);

                $task = [
                    'time' => trim($matches[1]),
                    'name' => $this->translate($originalTaskName),
                    'location' => trim($matches[4]),
                ];

                if ($originalTaskName === 'Robot-Game Match') {
                    if (preg_match('~<a[^>]+>([^<]+)\(([0-9]+)\)</a>\s*Tisch\s([^<]+)-\s*<a[^>]+>([^<]+)\(([0-9]+)\)</a>\s*Tisch\s([^<]+)<~', $matches[3], $robotGameMatches) === 1) {
                        $task['teams'] = [
                            [
                                'name' => trim($robotGameMatches[1]),
                                'number' => $robotGameMatches[2],
                                'table' => trim($robotGameMatches[3]),
                            ],
                            [
                                'name' => trim($robotGameMatches[4]),
                                'number' => $robotGameMatches[5],
                                'table' => trim($robotGameMatches[6]),
                            ],
                        ];
                    } else if (preg_match('~<a[^>]+>([^<]+)\(([0-9]+)\)</a>\s*Tisch\s([^<]+)-\s*(freiwilliges Team ohne Wertung|-)~', $matches[3], $robotGameMatches) === 1) {
                        $task['teams'] = [
                            [
                                'name' => trim($robotGameMatches[1]),
                                'number' => $robotGameMatches[2],
                                'table' => trim($robotGameMatches[3]),
                            ],
                            [
                                'name' => $robotGameMatches[4] === '-' ? 'Aucune' : 'Match à blanc',
                                'number' => '0',
                                'table' => 'Table 2',
                            ],
                        ];
                    } else if (preg_match('~(freiwilliges Team ohne Wertung|-)\s*-\s*<a[^>]+>([^<]+)\(([0-9]+)\)</a>\s*Tisch\s([^<]+)~', $matches[3], $robotGameMatches) === 1) {
                        $task['teams'] = [
                            [
                                'name' => $robotGameMatches[1] === '-' ? 'Aucune' : 'Match à blanc',
                                'number' => '0',
                                'table' => 'Table 1',
                            ],
                            [
                                'name' => trim($robotGameMatches[2]),
                                'number' => $robotGameMatches[3],
                                'table' => trim($robotGameMatches[4]),
                            ],
                        ];
                    } else if (!str_contains($matches[3], '<br>? - ?<br>')) {
                        $this->warn('Invalid robot game HTML');
                        $this->line($matches[3]);
                    }
                } else if (preg_match('~<a[^>]+>([^<]+)\(([0-9]+)\)</a~', $matches[3], $juryMatches) === 1) {
                    $task['team'] = [
                        'name' => trim($juryMatches[1]),
                        'number' => $juryMatches[2],
                    ];
                }

                $session['tasks'][] = $task;
            });

            $teamNumbers = [];

            foreach ($session['tasks'] as $task) {
                if (array_key_exists('team', $task)) {
                    $teamNumbers[] = $task['team']['number'];
                    continue;
                }

                if (array_key_exists('teams', $task)) {
                    foreach ($task['teams'] as $team) {
                        $teamNumbers[] = $team['number'];
                    }
                }
            }

            if (count($teamNumbers)) {
                $nonGermanTeams = array_diff($teamNumbers, $this->GERMAN_TEAMS);

                // If there are teams, and all are in the German array, we'll revert the translations
                if (count($nonGermanTeams) === 0) {
                    $session['name'] = $this->reverseTranslate($session['name']);

                    foreach ($session['tasks'] as &$task) {
                        $task['name'] = $this->reverseTranslate($task['name']);
                    }
                }
            }

            $sessions[] = $session;
        });

        file_put_contents(storage_path('app/matches.json'), json_encode($sessions, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
    }

    protected array $TRANSLATIONS = [
        // Challenge
        'Eröffnung Challenge' => 'Ouverture Challenge',
        'Jurybewertung' => 'Évaluation du jury',
        //'Jurygespräch' => '',
        'Robot-Game Testrunde' => 'Robot-Game Manche de test',
        'Robot-Game Vorrunde 1' => 'Robot-Game Manche 1',
        'Robot-Game Vorrunde 2' => 'Robot-Game Manche 2',
        'Robot-Game Vorrunde 3' => 'Robot-Game Manche 3',
        'Robot-Game Halbfinale' => 'Demi-finale Robot-Game',
        'Robot-Game Finale' => 'Finale Robot-Game',
        'Forschung auf der Bühne' => 'Présentations sur scène',
        'Preisverleihung Challenge' => 'Remise des prix Challenge',

        // Explore
        'Eröffnung Explore' => 'Ouverture Explore',
        'Begutachtung' => 'Évaluation',
        'Ausstellung' => 'Exposition',
        'Preisverleihung Explore' => 'Remise des prix Explore',
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
