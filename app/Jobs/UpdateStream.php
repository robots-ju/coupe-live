<?php

namespace App\Jobs;

use App\Events\StreamUpdated;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Storage;

class UpdateStream implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public ?string $youtubeVideoId)
    {
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
            if ($this->youtubeVideoId) {
                Storage::put('stream.txt', $this->youtubeVideoId);
            } else {
                Storage::delete('stream.txt');
            }

            broadcast(new StreamUpdated($this->youtubeVideoId));
        }
    }
}
