<?php

namespace App\Jobs;

use App\Events\StreamUpdated;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Storage;

class UpdateStream implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $youtubeVideoId;

    public function __construct(string $youtubeVideoId)
    {
        $this->youtubeVideoId = $youtubeVideoId;
    }

    public function handle()
    {
        $current = null; // Use null so even a blank value will trigger a file update

        try {
            $current = Storage::get('stream.txt');
        } catch (FileNotFoundException $exception) {
            // ignore errors
        }

        if ($this->youtubeVideoId !== $current) {
            Storage::put('stream.txt', $this->youtubeVideoId);

            broadcast(new StreamUpdated($this->youtubeVideoId));
        }
    }
}
