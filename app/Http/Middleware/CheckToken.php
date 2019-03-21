<?php

namespace App\Http\Middleware;

use Closure;

class CheckToken
{
    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
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
