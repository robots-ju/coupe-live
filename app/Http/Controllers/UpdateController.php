<?php

namespace App\Http\Controllers;

use App\Jobs\UpdateMatches;
use App\Jobs\UpdateStream;
use Illuminate\Http\Request;

class UpdateController extends Controller
{
    public function stream(Request $request)
    {
        $this->validate($request, [
            'video' => 'nullable|string',
        ]);

        dispatch(new UpdateStream($request->get('video') ?? ''));
    }

    public function matches(Request $request)
    {
        dispatch(new UpdateMatches($request->get('matches')));
    }
}
