<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckToken
{
    /**
     * @param Request $request
     * @param Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $token = config('live.token');

        if (!$token || $request->get('token') !== $token) {
            abort(403);
        }

        return $next($request);
    }
}
