<?php

namespace App\Http\Controllers;

use App\Jobs\UpdateMatches;
use GuzzleHttp\Utils;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
    public function toggle(Request $request)
    {
        if ($request->get('moderator_token') !== config('live.moderator_token')) {
            abort(403);
        }

        $completedTaskIndexesRaw = explode(',', Storage::get('completed.txt'));

        $completedTaskIndexes = [];

        foreach ($completedTaskIndexesRaw as $completedTaskIndexRaw) {
            if ($completedTaskIndexRaw === '') {
                continue;
            }

            $completedTaskIndexes[] = (int)$completedTaskIndexRaw;
        }

        $taskIndex = (int)$request->get('task');

        $state = in_array($taskIndex, $completedTaskIndexes);

        if ($state) {
            $completedTaskIndexes = array_filter($completedTaskIndexes, function ($index) use ($taskIndex) {
                return $index !== $taskIndex;
            });
        } else {
            $completedTaskIndexes[] = $taskIndex;
            sort($completedTaskIndexes);
        }

        Storage::put('completed.txt', implode(',', $completedTaskIndexes));

        $schedule = Utils::jsonDecode(Storage::get('schedule.json') ?? '[]', true);

        $runningIndex = 0;

        $matches = array_map(function ($session) use (&$runningIndex, $completedTaskIndexes) {
            $session['tasks'] = array_map(function ($task) use (&$runningIndex, $completedTaskIndexes) {
                if (in_array($runningIndex, $completedTaskIndexes)) {
                    $task['completed'] = true;
                }

                $runningIndex++;

                return $task;
            }, $session['tasks']);

            return $session;
        }, $schedule);

        dispatch(new UpdateMatches($matches));

        return response('', 204);
    }
}
