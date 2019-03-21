<?php

namespace App\Console\Commands;

use App\Jobs\UpdateStream;
use Illuminate\Console\Command;

class SetStream extends Command
{
    protected $signature = 'stream:set {youtubeVideoId?}';
    protected $description = 'Set the video to stream. No video ID will disable the stream';

    public function handle()
    {
        dispatch(new UpdateStream($this->argument('youtubeVideoId') ?? ''));
    }
}
