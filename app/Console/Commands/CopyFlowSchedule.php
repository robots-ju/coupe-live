<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\DomCrawler\Crawler;

class CopyFlowSchedule extends Command
{
    protected $signature = 'copy-flow-schedule {path}';
    protected $description = 'Copy FLL Flow schedule';

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
                                'team' => (int)$robotGameMatches[2],
                                'table' => trim($robotGameMatches[3]),
                            ],
                            [
                                'team' => (int)$robotGameMatches[5],
                                'table' => trim($robotGameMatches[6]),
                            ],
                        ];
                    } else if (preg_match('~<a[^>]+>([^<]+)\(([0-9]+)\)</a>\s*Tisch\s([^<]+)-\s*(freiwilliges Team ohne Wertung|-)~', $matches[3], $robotGameMatches) === 1) {
                        $task['teams'] = [
                            [
                                'team' => (int)$robotGameMatches[2],
                                'table' => trim($robotGameMatches[3]),
                            ],
                            [
                                'team' => $robotGameMatches[4] === '-' ? 'Aucune' : 'Match à blanc',
                                'table' => 'Table ' . (trim($robotGameMatches[3]) === 'Table A' ? 'B' : 'D'),
                            ],
                        ];
                    } else if (preg_match('~(freiwilliges Team ohne Wertung|-)\s*-\s*<a[^>]+>([^<]+)\(([0-9]+)\)</a>\s*Tisch\s([^<]+)~', $matches[3], $robotGameMatches) === 1) {
                        $task['teams'] = [
                            [
                                'team' => $robotGameMatches[1] === '-' ? 'Aucune' : 'Match à blanc',
                                'table' => 'Table ' . (trim($robotGameMatches[4]) === 'Table B' ? 'A' : 'C'),
                            ],
                            [
                                'team' => (int)$robotGameMatches[3],
                                'table' => trim($robotGameMatches[4]),
                            ],
                        ];
                    } else if (!str_contains($matches[3], '<br>? - ?<br>')) {
                        $this->warn('Invalid robot game HTML');
                        $this->line($matches[3]);
                    }
                } else if (preg_match('~<a[^>]+>([^<]+)\(([0-9]+)\)</a~', $matches[3], $juryMatches) === 1) {
                    $task['team'] = (int)$juryMatches[2];
                }

                $session['tasks'][] = $task;
            });

            $sessions[] = $session;
        });

        $stringified = json_encode($sessions, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        file_put_contents(storage_path('app/schedule.json'), $stringified);
        file_put_contents(storage_path('app/matches.json'), $stringified);
        // If tasks were marked completed, a call to the moderation endpoint will be needed to re-apply
    }

    protected array $TRANSLATIONS = [
        // For this bilingual version we will translate client-side. But we can use this feature to remove the Challenge references
        'Eröffnung Challenge' => 'Eröffnung',
        'Preisverleihung Challenge' => 'Preisverleihung',
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
