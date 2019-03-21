<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class StreamUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $youtubeVideoId;

    public function __construct(string $youtubeVideoId)
    {
        $this->youtubeVideoId = $youtubeVideoId;
    }

    public function broadcastOn()
    {
        return new Channel('live');
    }
}
